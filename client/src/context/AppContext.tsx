// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  type Wallet,
} from "@solana/wallet-adapter-react";
import {
  WalletIcon,
  WalletModal,
  WalletModalContext,
  WalletModalProvider,
  useWalletModal,
  type WalletModalProps,
} from "@solana/wallet-adapter-react-ui";

// import { ProgramContextProvider } from "./ProgramContext";
import { endpoint, network, wallets } from "../constants";
export function AppContext({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          {/* <ProgramContextProvider>{children}</ProgramContextProvider> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
