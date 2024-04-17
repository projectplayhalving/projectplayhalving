import { Program } from "@coral-xyz/anchor";
import { PlayHalving } from "../../target/types/play_halving";
import { bettingMint, programSettings } from "../config";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { getProgramConfigPDADef } from "../PDAs";
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { loadWalletKey } from "../loadKp";

export const adminWallet = loadWalletKey(__dirname + "/../deployment.json");
const run = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.PlayHalving as Program<PlayHalving>;
  const connection = program.provider.connection;

  if (provider.connection.rpcEndpoint.includes("localhost")) {
    console.log("Running on localnet...");
    // await connection.confirmTransaction(
    //   await provider.connection.requestAirdrop(
    //     adminWallet.publicKey,
    //     10 * LAMPORTS_PER_SOL
    //   )
    //   //     {
    //   //   signature:await provider.connection.requestAirdrop(
    //   //     adminWallet.publicKey,
    //   //     10 * LAMPORTS_PER_SOL
    //   //   ) ,
    //   //   ...(await connection.getLatestBlockhash("confirmed")),
    //   // }
    // );
  }

  const [programConfigPDA, _config_bump] = getProgramConfigPDADef(
    program.programId
  );

  const programVault = getAssociatedTokenAddressSync(
    bettingMint,
    programConfigPDA,
    true
  );
  const tx = await program.methods
    .initialize(programSettings)
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
  const bhash = await connection.getLatestBlockhash("confirmed");

  await connection.confirmTransaction(
    {
      signature: tx,
      ...bhash,
    },
    "confirmed"
  );
};
run();
