import * as anchor from "@coral-xyz/anchor";
import { readFileSync } from "fs";
import bs58 from "bs58";

export function loadWalletKey(keypairFile: string): anchor.web3.Keypair {
  if (!keypairFile || keypairFile == "") {
    throw new Error("Keypair is required!");
  }

  const wallBuf = new Uint8Array(
    JSON.parse(readFileSync(keypairFile).toString())
  );
  let privKey = bs58.encode(wallBuf);
  console.log({ privKey });
  const loaded = anchor.web3.Keypair.fromSecretKey(wallBuf);
  return loaded;
}
