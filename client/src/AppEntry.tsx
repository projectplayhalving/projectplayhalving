import { WalletButtonEntry } from "./components/WalletButton";
import { AppContext } from "./context";

export const AppEntry = () => {
  return (
    <AppContext>
      <WalletButtonEntry container="#walletButton" />
    </AppContext>
  );
};
