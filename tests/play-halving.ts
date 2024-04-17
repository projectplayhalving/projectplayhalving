import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";

import { join } from "path";
import { Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  transfer,
} from "@solana/spl-token";
import {
  getSecondStateAcc,
  getProgramConfigPDADef,
  getUserStateAcc,
} from "../sdk/PDAs";
import { assert, expect } from "chai";
import { bettingMint } from "../sdk/config";
import { getRandomTimestamp, randomBetween } from "../sdk/utils";

const ANCHOR_TOML_PATH = join(__dirname, "../Anchor.toml");

import { loadWalletKey } from "../sdk/loadKp";

export const adminWallet = loadWalletKey(__dirname + "/../deployment.json");
// const adminWallet = Keypair.generate();

const mintKp = Keypair.generate();
const buyers = Array.from({ length: 100 }, (_, i) => {
  const kp = Keypair.generate();
  return {
    kp,
  };
});

describe("play-halving", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.PlayHalving as Program<PlayHalving>;
  const connection = program.provider.connection;

  // tests prelude
  let bettingMint: anchor.web3.PublicKey = mintKp.publicKey;
  before(async () => {
    await connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        adminWallet.publicKey,
        100 * LAMPORTS_PER_SOL
      )
    );

    bettingMint = await createMint(
      connection,
      adminWallet,
      adminWallet.publicKey,
      adminWallet.publicKey,
      2,
      mintKp
    );
    await Promise.all(
      buyers.map(async (b) => {
        await connection.confirmTransaction(
          await provider.connection.requestAirdrop(
            b.kp.publicKey,
            3 * LAMPORTS_PER_SOL
          )
        );
        const ata = await getOrCreateAssociatedTokenAccount(
          connection,
          adminWallet,
          bettingMint,
          b.kp.publicKey,
          false
        );
        await mintTo(
          connection,
          adminWallet,
          bettingMint,
          ata.address,
          adminWallet,
          200000
        );
      })
    );
  });

  // const subscriptionId = program.addEventListener("ClaimEvent", (event) => {
  //   console.log("ClaimEvent", event);
  // });
  // const subscriptionId2 = program.addEventListener("PlaceBetEvent", (event) => {
  //   console.log("PlaceBetEvent", event);
  // });
  // const subscriptionId3 = program.addEventListener(
  //   "BuyTicketsEvent",
  //   (event) => {
  //     console.log("BuyTicketsEvent", event);
  //   }
  // );

  const [programConfigPDA, _config_bump] = getProgramConfigPDADef(
    program.programId
  );

  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );

  const CLAIMING_WINDOW_SECONDS = 90;
  // this is how you get anchor workspace account types
  type ProgramSettings =
    anchor.IdlAccounts<PlayHalving>["programConfig"]["settings"];
  const programTestSettings: ProgramSettings = {
    betFee: new BN(5),
    grandRewardsPool: new BN(100000),
    minTicketsSold: new BN(20000),
    hourReturnPc: 25,
    minuteReturnPc: 50,
    betsFreeBundle: 2,
    paidBetsForFreeBundle: 5,
    claimWindowHours: 1, //in sec for testing
  };
  it("Is initialized!", async () => {
    const tx = await program.methods
      .initialize(programTestSettings)
      .accounts({
        admin: adminWallet.publicKey,
        programConfig: programConfigPDA,
        programVault: programVault,
        bettingMint,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([adminWallet])
      .rpc();
    console.log("init signature", tx);

    // const programConfigAcc = await program.account.programConfig.all();
    // programConfigAcc.map(console.log);
    const r = await connection.confirmTransaction(tx, "confirmed");
    expect(r.value.err).to.be.null;
  });
  it("Lets users buy tickets", async () => {
    const buyersWithNumTickets = buyers.map((b) => ({
      ...b,
      numTickets: randomBetween(1, 50),
    }));
    await Promise.all(
      buyersWithNumTickets.map(async (b) => {
        const ata = await getOrCreateAssociatedTokenAccount(
          connection,
          adminWallet,
          bettingMint,
          b.kp.publicKey,
          false
        );
        const tx = await program.methods
          .buyTickets(b.numTickets)
          .accounts({
            buyer: b.kp.publicKey,
            buyerAta: ata.address,
            programConfig: programConfigPDA,
            programVault: programVault,
            bettingMint,
            userStateAcc: getUserStateAcc(b.kp.publicKey, program.programId)[0],
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([b.kp])
          .rpc();
        const r = await connection.confirmTransaction(tx, "confirmed");
        expect(r.value.err).to.be.null;
        // console.log({ r });
        // console.log("buy tickets signature", tx);
      })
    );
    // console.log("user state accs
    // const userStateAccs = await program.account.userBetsState.all();
    // userStateAccs.map(console.log);
  });
  it("Lets users place bets with their tickets", async () => {
    // let userBetsStateAccs = await program.account.userBetsState.all();

    await Promise.all(
      buyers.map(async (b) => {
        // const userStateData = userBetsStateAccs.find((acc) => {
        //   acc.publicKey == b.kp.publicKey;
        // });
        const timestamp_bet = getRandomTimestamp();
        const secondStateAcc = getSecondStateAcc(
          timestamp_bet,
          program.programId
        )[0];
        const tx = await program.methods
          .placeBet(new anchor.BN(timestamp_bet))
          .accounts({
            buyer: b.kp.publicKey,
            programConfig: programConfigPDA,
            secondStateAcc,
            userStateAcc: getUserStateAcc(b.kp.publicKey, program.programId)[0],
            systemProgram: SystemProgram.programId,
          })
          .signers([b.kp])
          .rpc();
        const r = await connection.confirmTransaction(tx, "confirmed");
        expect(r.value.err).to.be.null;
        // console.log({ r });
        // console.log("buy tickets signature", tx);
      })
    );
  });
  it("Lets admin pause betting", async () => {
    const tx = await program.methods
      .pauseBetting()
      .accounts({
        admin: adminWallet.publicKey,
        programConfig: programConfigPDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([adminWallet])
      .rpc();

    // Confirm transaction
    const r = await connection.confirmTransaction(tx, "confirmed");
    expect(r.value.err).to.be.null;
  });
  it("Lets admin mark a winner timestamp", async () => {
    let tstmp = getRandomTimestamp();
    const tx = await program.methods
      .markHalving(new anchor.BN(tstmp))
      .accounts({
        admin: adminWallet.publicKey,
        secondStateAcc: getSecondStateAcc(tstmp, program.programId)[0],
        programVault,
        programConfig: programConfigPDA,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([adminWallet])
      .rpc();

    // Confirm transaction
    const r = await connection.confirmTransaction(tx, "confirmed");
    expect(r.value.err).to.be.null;
  });
  it("Lets users claim rewards and checks their rewards", async () => {
    // Loop through each buyer
    for (let buyer of buyers) {
      // Get the buyer's initial rewards before claiming
      // const initialRewards = await getBuyerRewards(buyer);
      const ata = await getAssociatedTokenAddress(
        bettingMint,
        buyer.kp.publicKey,
        false
      );
      // Claim rewards
      const tx = await program.methods
        .claim()
        .accounts({
          buyer: buyer.kp.publicKey,
          buyerAta: ata,
          programConfig: programConfigPDA,
          programVault: programVault,
          bettingMint: bettingMint,
          userStateAcc: getUserStateAcc(
            buyer.kp.publicKey,
            program.programId
          )[0],
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([buyer.kp])
        .rpc();

      // Confirm transaction
      const r = await connection.confirmTransaction(tx, "confirmed");
      expect(r.value.err).to.be.null;
      //TODO actually check rewards distrib
      // Get the buyer's rewards after claiming
      // const finalRewards = await getBuyerRewards(buyer);

      // // Check if the buyer's rewards have been correctly updated
      // expect(finalRewards).to.be.greaterThan(initialRewards);
    }
  });

  it("Lets admins close the program and withdraw rewards", async () => {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      adminWallet,
      bettingMint,
      adminWallet.publicKey,
      false
    );

    let ataAmount1 = await connection.getTokenAccountBalance(ata.address);
    // Claim rewards
    const tx = await program.methods
      .close()
      .accounts({
        admin: adminWallet.publicKey,
        adminAta: ata.address,
        programConfig: programConfigPDA,
        programVault: programVault,
        bettingMint: bettingMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([adminWallet])
      .rpc();
    const r = await connection.confirmTransaction(tx, "confirmed");
    // let ataAmount2 = await connection.getTokenAccountBalance(ata.address);
    // expect(ataAmount2.value.uiAmount).to.be.greaterThan(
    //   ataAmount1.value.uiAmount
    // );
    expect(r.value.err).to.be.null;
  });
});
