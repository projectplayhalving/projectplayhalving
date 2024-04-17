import { truncateMiddle } from "../utils";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";
import { createPortal } from "react-dom";
import { WalletReadyState, type WalletName } from "@solana/wallet-adapter-base";
import type { WalletModalProps } from "@solana/wallet-adapter-react-ui";
import { useWallet, type Wallet } from "@solana/wallet-adapter-react";
import type { PortalProps } from "../types";

export const WalletButtonEntry: FC<PortalProps> = ({
  container = "#walletButton",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    wallets,
    select,
    connected,
    connecting,
    disconnect,
    wallet: connectedWallet,
  } = useWallet();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [portal, setPortal] = useState<Element | null>(null);
  console.log({ portal });
  const [listedWallets, collapsedWallets] = useMemo(() => {
    const installed: Wallet[] = [];
    const notInstalled: Wallet[] = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      } else {
        notInstalled.push(wallet);
      }
    }

    return installed.length ? [installed, notInstalled] : [notInstalled, []];
  }, [wallets]);

  const hideModal = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => setVisible(false), 150);
  }, [setVisible]);

  const handleClose = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      hideModal();
    },
    [hideModal]
  );
  useLayoutEffect(
    () => setPortal(document.querySelector(container)),
    [container]
  );
  const handleWalletClick = useCallback(
    (event: any, walletName: WalletName) => {
      console.log({ walletName, event });
      select(walletName);
      handleClose(event);
    },
    [select, handleClose]
  );

  const handleCollapseClick = useCallback(
    () => setExpanded(!expanded),
    [expanded]
  );

  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      const node = ref.current;
      if (!node) return;

      // here we query all focusable elements
      const focusableElements = node.querySelectorAll("button");
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const firstElement = focusableElements[0]!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (event.shiftKey) {
        // if going backward by pressing tab and firstElement is active, shift focus to last focusable element
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        // if going forward by pressing tab and lastElement is active, shift focus to first focusable element
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    },
    [ref]
  );

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideModal();
      } else if (event.key === "Tab") {
        handleTabKey(event);
      }
    };

    // Get original overflow
    if (visible) {
      const { overflow } = window.getComputedStyle(document.body);
      // Hack to enable fade in animation after mount
      setTimeout(() => setFadeIn(true), 0);
      // Prevent scrolling on mount
      document.body.style.overflow = "hidden";
      // Listen for keydown events
      window.addEventListener("keydown", handleKeyDown, false);
      return () => {
        // Re-enable scrolling when component unmounts
        document.body.style.overflow = overflow;
        window.removeEventListener("keydown", handleKeyDown, false);
      };
    }
  }, [hideModal, handleTabKey]);

  console.log({ visible });
  const addr = connectedWallet?.adapter.publicKey?.toString();
  const [displayText, setDisplayText] = useState("Connecting...");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseOver = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    connected && setDisplayText("Disconnect Wallet");
  };
  useLayoutEffect(() => {
    addr && setDisplayText(truncateMiddle(addr));
  }, [addr]);
  const handleMouseOut = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    if (connected && addr) {
      const id = setTimeout(() => setDisplayText(truncateMiddle(addr)), 1000);
      setTimeoutId(id);
    }
  }, [addr, connected]);
  console.log({ visible });
  const WalletModal = () => (
    <div
      className={visible ? "fade modal-dialog show" : "fade modal-dialog "}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <style>{`
  .modal-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10;
    transform: translate(-50%, -50%);
  }

  .modal-dialog.fade {
      opacity: 0;
    }
   .show{
    transition: opacity 1.3s;
    opacity:1!important
  }

  .modal-dialog.show {
    transition: opacity 1s;
    opacity: 1;
  }

  .close {
    margin-bottom: 0;
  }

  .wallet-img {
    max-width: 327px;
  }

  .wallet-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .crypto {
    padding-bottom: 10px;
    cursor: pointer;
    height: auto;
    justify-content: center;
  }

  .crypto-icon {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
`}</style>
      <div className="modal-document">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setVisible(false);
              }}
            >
              <span aria-hidden="true">
                <img src="img/cross%201.svg" alt="" />
              </span>
            </button>
          </div>
          <div className="modal-body">
            <div className="flex-wallet">
              <img className="wallet-img" src="img/left-wallet.png" alt="" />
              <div className="modal-cnt-wallets">
                <div className="connect-wallet-modal">
                  <div className="connect">Connect Wallet</div>
                  <div className="us">
                    {listedWallets.length
                      ? "Select your wallet to connect with us"
                      : "You'll need a Solana wallet to continue"}
                  </div>
                </div>
                <div className="wallet-grid">
                  {listedWallets.concat(collapsedWallets).map((w, i) => {
                    return (
                      <div
                        className="crypto"
                        onClick={(event) =>
                          handleWalletClick(event, w.adapter.name)
                        }
                      >
                        <div className="crypto-text">
                          <img
                            src={w.adapter.icon}
                            alt={`${w.adapter.name} icon`}
                            className="crypto-icon"
                          />
                          <span>{w.adapter.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {portal &&
        createPortal(
          <button
            // disabled={
            //   buttonState === "connecting" || buttonState === "disconnecting"
            // }
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => (!connected ? setVisible(!visible) : disconnect())}
            type="button"
            className="connect-wallet"
            style={{ width: 300, justifyContent: "center" }}
          >
            {!connected && <img src="img/fi-rr-plug.svg" alt="" />}
            <span>
              {!connected && !connecting
                ? "Connect Wallet"
                : connected && !connecting
                ? displayText
                : connecting
                ? "Connecting..."
                : "Connected" || "Connecting..."}
            </span>
          </button>,
          portal
        )}
      <WalletModal />
    </>
  );
};
