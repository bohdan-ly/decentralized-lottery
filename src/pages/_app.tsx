import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={
        process.env.NEXT_PUBLIC_MORALIS_APP_ID ?? "AppId Undefined Fallback"
      }
      serverUrl={
        process.env.NEXT_PUBLIC_MORALIS_SERVER_ID ??
        "ServerUrl Undefined Fallback"
      }
      initializeOnMount={false}
    >
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </MoralisProvider>
  );
}
