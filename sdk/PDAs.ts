import { PublicKey } from "@solana/web3.js";
import { seeds } from "./config";
import { sToB } from "./utils";
import * as anchor from "@coral-xyz/anchor";

type PDADef = [PublicKey, number];
export const getUserStateAcc = (
  user: PublicKey,
  programId: PublicKey
): PDADef => {
  return PublicKey.findProgramAddressSync(
    [sToB(seeds.SEEDS_PREFIX), sToB(seeds.USER_STATE), user.toBuffer()],
    programId
  );
};
export const getSecondStateAcc = (
  timestamp: number,
  programId: PublicKey
): PDADef => {
  return PublicKey.findProgramAddressSync(
    [
      sToB(seeds.SEEDS_PREFIX),
      sToB(seeds.SECOND_STATE),
      new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
};
export const getProgramConfigPDADef = (programId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [sToB(seeds.SEEDS_PREFIX), sToB(seeds.PROGRAM_CONFIG)],
    programId
  );
