import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { ManualHeader } from "@/components";
import { LotteryEntrance } from "@/components/entrance";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Blockchain Lottery</title>
        <meta
          name="description"
          content="The fairest lottery in the world using smart contract"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ManualHeader />
        <LotteryEntrance />
      </main>
    </>
  );
}
