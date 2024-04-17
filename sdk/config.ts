import { BN, IdlAccounts } from "@coral-xyz/anchor";
import { PlayHalving } from "../target/types/play_halving";
import { PublicKey, Keypair } from "@solana/web3.js";

export const adminWallet = Keypair.generate();
// this is how you get anchor workspace account types
export type ProgramSettings =
  IdlAccounts<PlayHalving>["programConfig"]["settings"];
export const programSettings: ProgramSettings = {
  betFee: new BN(5),
  grandRewardsPool: new BN(100000),
  minTicketsSold: new BN(25000),
  hourReturnPc: 25,
  minuteReturnPc: 50,
  betsFreeBundle: 2,
  paidBetsForFreeBundle: 5,
  claimWindowHours: 48,
};

//USDC
export const bettingMintAddy = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const bettingMint = new PublicKey(bettingMintAddy);

export const seeds = {
  SEEDS_PREFIX: "PLAY_HALVING_____",
  PROGRAM_CONFIG: "PROGRAM_CONFIG",
  SECOND_STATE: "SECOND_STATE",
  USER_STATE: "USER_STATE",
};
