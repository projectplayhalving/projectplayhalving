import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  HuobiWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

export const network = WalletAdapterNetwork.Devnet;
export const wallets = [
  /**
   * Wallets that implement either of these standards will be available automatically.
   *
   *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
   *     (https://github.com/solana-mobile/mobile-wallet-adapter)
   *   - Solana Wallet Standard
   *     (https://github.com/solana-labs/wallet-standard)
   *
   * If you wish to support a wallet that supports neither of those standards,
   * instantiate its legacy wallet adapter here. Common legacy adapters can be found
   * in the npm package `@solana/wallet-adapter-wallets`.
   */
  new WalletConnectWalletAdapter({
    network: network,
    options: {},
  }),
  new SolflareWalletAdapter({
    network: network,
  }),
  new PhantomWalletAdapter({
    network: network,
  }),
  new CoinbaseWalletAdapter(),
  new HuobiWalletAdapter(),
  new Coin98WalletAdapter(),
];

// export const API_KEY = "2214b95a-3fb9-4b3e-93ac-f0aceb0935ec";
// export const RPC_WSS = "wss://kiki-stream.hellomoon.io";
// export const RPC_URL = `https://rpc.hellomoon.io/${API_KEY}`;
// export const SUB_ID = "2214b95a-3fb9-4b3e-93ac-f0aceb0935ec";
// export const endpoint = RPC_URL;
export const endpoint = clusterApiUrl(network);
