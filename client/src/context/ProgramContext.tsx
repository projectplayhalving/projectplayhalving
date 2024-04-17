import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { IDL, type PlayHalving } from "../../../target/types/play_halving";
import {
  // ConfirmedSignatureInfo,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { bettingMint, bettingMintAddy } from "../../../sdk/config";
import { SolanaParser } from "@debridge-finance/solana-transaction-parser";
import {
  getProgramConfigPDADef,
  getSecondStateAcc,
  getUserStateAcc,
} from "../../../sdk/PDAs";
// import { type PlayHalving } from "../../../target/types/play_halving";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import pk from "bn.js";
const BN = pk.BN;
// import {
//   InboundTransactionListener,
//   SubscriptionStreamManager,
// } from "@/services/sol-listener";
// import { SUB_ID } from "@/constants";

type ProgramData = {
  buyTicketsIxn: (
    numTickets: number
  ) => Promise<anchor.web3.TransactionInstruction>;
  placeBetIxn: (
    timestamp: number
  ) => Promise<anchor.web3.TransactionInstruction>;
  claimIxn: () => Promise<anchor.web3.TransactionInstruction>;
};
const ProgramContext = createContext<ProgramData | undefined>(undefined);

// TODO
const programAddy = "AwhF2my6A4mmpBBSP2UAWFo4392DY6Vp6TdrP1uFPCvu";
const programId = new PublicKey(programAddy);

export type TxnSummary = {
  wallet: string;
  timestamp: number;
  sig: string;
  totalAmountTickets: number;
};
export const useProgram = () => useContext(ProgramContext);
const useProgramListeners = () =>
  // : TxnSummary[]
  {
    //@ts-ignore
    const program = new anchor.Program<PlayHalving>(
      IDL,
      programId
      // anchorProvider
    );
    const subscriptionId = program.addEventListener("ClaimEvent", (event) => {
      console.log("ClaimEvent", event);
    });
    const subscriptionId2 = program.addEventListener(
      "PlaceBetEvent",
      (event) => {
        console.log("PlaceBetEvent", event);
      }
    );
    const subscriptionId3 = program.addEventListener(
      "BuyTicketsEvent",
      (event) => {
        console.log("BuyTicketsEvent", event);
      }
    );
    // const programConfigPDA = getProgramConfigPDADef(programId)[0];
    // const [txnList, setTxnList] = useState<TxnSummary[]>([]);
    // const { connection } = useConnection();
    // useEffect(() => {
    //   const f = async () => {
    //     const txParser = new SolanaParser([
    //       { idl: IDL as PlayHalving, programId: programAddy },
    //     ]);
    //     const t = await connection.getConfirmedSignaturesForAddress2(programId);
    //     for (let sig of t) {
    //       const txn = await connection.getTransaction(sig.signature);
    //       const parsed = await txParser.parseTransaction(
    //         connection,
    //         sig.signature
    //       );
    //       // const eventParser = new anchor.EventParser(
    //       //   programId,
    //       //   new anchor.BorshCoder(IDL)
    //       // );
    //       // console.log(txn, parsed);
    //       // if (txn?.meta?.logMessages) {
    //       //   console.log(txn.meta.logMessages);
    //       //   const events = eventParser.parseLogs(txn?.meta?.logMessages);
    //       //   for (let event of events) {
    //       //     console.log(event);
    //       //   }
    //       // }
    //     }
    //   };
    //   setInterval(f, 2000);
    // }, [connection, programConfigPDA]);
    // return txnList;
  };
// new InboundTransactionListener(SUB_ID, (txs) => {
//   txs.map(console.log);
// });

// const initStream = useCallback(async (): Promise<void> => {
//   console.log({ programConfigPDA: programConfigPDA.toString() });
//   // const streamManager = new SubscriptionStreamManager(
//   //   bettingMintAddy,
//   //   programConfigPDA.toString()
//   // );
//   // console.log({ streamManager });
//   // const subData = await streamManager.init();
//   // if (!subData?.subscriptionId) {
//   //   console.error("Subscription not created");
//   // } else {
//   // const subId = subData.subscriptionId;

//   // const cleanupStream = async () => {
//   //   console.log("Closing stream sub..");
//   //   await streamManager.closeStream(subId);
//   //   process.exit(0);
//   // };
//   // return cleanupStream;
// }, [programConfigPDA]);
// useEffect(() => {
//   initStream();
// }, [programConfigPDA, initStream]);
// to subscribe for all mints:
// const allMintsSubId = "5a47d17c-6e2e-42f6-bea9-7e458e91adce"

// const parsed = txParser.parseTransaction(connection, sig.signature, false);
// // console.log({ parsed });
// connection.onSignature(txId, (updatedTxInfo, context) =>
//   console.log("Updated account info: ", updatedTxInfo)
// );
// return txnList;

export const ProgramContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { connection } = useConnection();

  const wallet = useAnchorWallet();
  const [userBetStateInfo, setUserBetStateInfo] = useState();
  const programData = useProgramListeners();
  if (!wallet) {
    return (
      <ProgramContext.Provider value={undefined}>
        {children}
      </ProgramContext.Provider>
    );
  } else {
    const anchorProvider = new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    );
    //@ts-ignore
    const program = new anchor.Program<PlayHalving>(
      IDL,
      programId,
      anchorProvider
    );

    const programConfigPDA = getProgramConfigPDADef(programId)[0];
    const programVault = getAssociatedTokenAddressSync(
      bettingMint,
      programConfigPDA,
      true
    );
    const userStateAcc = getUserStateAcc(wallet.publicKey, TOKEN_PROGRAM_ID)[0];
    const buyTicketsIxn = (numTickets: number) => {
      const buyerAta = getAssociatedTokenAddressSync(
        bettingMint,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID
      );
      return program.methods
        .buyTickets(numTickets)
        .accountsPartial({
          buyer: wallet.publicKey,
          buyerAta,
          programVault,
          programConfig: programConfigPDA,
          bettingMint,
          userStateAcc,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();
    };
    const placeBetIxn = (timestamp: number) => {
      const secondStateAcc = getSecondStateAcc(timestamp, program.programId)[0];

      return program.methods
        .placeBet(new BN(timestamp))
        .accountsPartial({
          buyer: wallet.publicKey,
          programConfig: programConfigPDA,
          userStateAcc,
          secondStateAcc,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
    };
    const claimIxn = async () => {
      const ata = await getAssociatedTokenAddress(
        bettingMint,
        wallet.publicKey,
        false
      );
      // Claim rewards
      return await program.methods
        .claim()
        .accountsPartial({
          buyer: wallet.publicKey,
          buyerAta: ata,
          programConfig: programConfigPDA,
          programVault: programVault,
          bettingMint: bettingMint,
          userStateAcc: getUserStateAcc(wallet.publicKey, program.programId)[0],
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .instruction();
    };
    // const ads = program.account.userBetsState.subscribe(userStateAcc);
    // ads.on("change", (info) => {
    //   console.log({ userStateAccInfo: info });
    // });

    // const userBetStateInfo = await program.account.userBetsState.fetch(
    //   userStateAcc
    // );
    // console.log("sssttt", { userBetStateInfo });
    return (
      <ProgramContext.Provider
        value={{
          buyTicketsIxn,
          placeBetIxn,
          claimIxn,
        }}
      >
        {children}
      </ProgramContext.Provider>
    );
  }
};
