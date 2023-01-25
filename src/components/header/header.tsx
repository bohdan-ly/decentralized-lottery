import React from "react";
import { useMoralis } from "react-moralis";
import styles from "@/styles/Header.module.css";
import { BasicLoader } from "../loaders";

export const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    isWeb3EnableLoading,
    Moralis,
    deactivateWeb3,
  } = useMoralis();

  const disconnectWallet = () => {
    Moralis.onAccountChanged((account) => {
      if (!account) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  };

  React.useEffect(() => {
    if (isWeb3Enabled) return;
    if (window?.localStorage?.getItem("connected")) {
      enableWeb3();
    }
    disconnectWallet();
  }, []);

  const handleConnect = async () => {
    if (!isWeb3Enabled) {
      const res = await enableWeb3();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("connected", "injected");
      }
    }
  };

  return (
    <header className={styles.header}>
      <h1>Decentralized Lottery</h1>

      {isWeb3EnableLoading ? (
        <BasicLoader />
      ) : (
        <button
          className={styles.connect_button}
          onClick={handleConnect}
          disabled={isWeb3Enabled}
        >
          <span
            className={!account ? styles.button_top : styles.button_disabled}
          >
            {!account ? (
              "Connect"
            ) : (
              <div>Connected to {account.slice(0, 6)}</div>
            )}
          </span>
        </button>
      )}
    </header>
  );
};
