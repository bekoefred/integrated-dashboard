import "@components/styles/globals.css";
import type { AppProps } from "next/app";
import SocketsProvider from "../../context/socket.context";
import { SessionProvider } from "next-auth/react";
import { store } from "../redux/store";
import { Provider } from "react-redux";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <SocketsProvider>
          <Component {...pageProps} />
        </SocketsProvider>
      </Provider>
    </SessionProvider>
  );
}
