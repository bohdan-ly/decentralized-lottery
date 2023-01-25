import { abi, contractAddresses } from "@/constants";
import styles from "@/styles/Entrance.module.css";
import BigNumber from "bignumber.js";
import { ethers, ContractTransaction } from "ethers";
import React from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { BasicLoader } from "../loaders";
import { Ethereum } from "./ethereum";
import { useNotification } from "web3uikit";

export const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(
    chainIdHex || ""
  ).toString() as keyof typeof contractAddresses;
  const contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : "";

  const [entranceFee, setEntranceFee] = React.useState("0");
  const [numPlayers, setNumPlayers] = React.useState("0");
  const [recentWinner, setRecentWinner] = React.useState("");
  const [isEntranceLoading, setIsEntranceLoading] = React.useState(false);

  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getNumOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi,
    contractAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const dispatchNotification = useNotification();

  const syncLottery = async () => {
    const fee = (await getEntranceFee({
      onError: (e) => console.error(e),
    })) as BigNumber;

    const players = (await getNumOfPlayers({
      onError: (e) => console.error(e),
    })) as BigNumber;
    const winner = (await getRecentWinner({
      onError: (e) => console.error(e),
    })) as string;
    setNumPlayers(players.toString());
    setRecentWinner(!winner.indexOf("0x000") ? "" : winner.slice(0, 6));
    setEntranceFee((fee || 0).toString());
  };

  React.useEffect(() => {
    if (isWeb3Enabled) {
      syncLottery();
      // listenToEvents();
    }
  }, [isWeb3Enabled]);

  // const listenToEvents = () => {
  //   if (window?.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const lottery = new ethers.Contract(contractAddress, abi, signer);
  //     lottery.on("WinnerPicked", (from, to) => {
  //       if (typeof to.event === "string" && to.event.includes("WinnerPicked")) {
  //         console.log(from, to);
  //         syncLottery();
  //       }
  //     });
  //   }
  // };

  const handleNewNotification = () => {
    dispatchNotification({
      type: "info",
      message: "Transaction complete",
      title: "Lottery Notification",
      position: "topR",
    });
  };

  const handleSuccess = async (res: unknown) => {
    const tx = res as ContractTransaction;
    await tx.wait(1);
    handleNewNotification();
    syncLottery();
  };

  const handleEntrance = async () => {
    setIsEntranceLoading(true);
    await enterLottery({
      onSuccess: handleSuccess,
      onError: (e) => console.error(e),
    });
    setIsEntranceLoading(false);
  };

  return (
    <section className={styles.entrance}>
      <h1>Lottery Entrance</h1>

      <div className={styles.card}>
        {contractAddress ? (
          <div className={styles.content}>
            <p>
              Lottery entrance fee:{" "}
              {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </p>
            <p>Number of players: {numPlayers}</p>
            {!!recentWinner && <p>Recent winner: {recentWinner}</p>}
            {isEntranceLoading ? (
              <BasicLoader />
            ) : (
              <button
                className={styles.entrance_button}
                onClick={handleEntrance}
              >
                Enter Lottery
              </button>
            )}
          </div>
        ) : (
          <div className={styles.content}>
            Lottery not found. Please try again later
          </div>
        )}
        <Ethereum />
      </div>
    </section>
  );
};
