// import Navbar from "@components/components/Shared/Navbar";
import Survey from "@components/components/Survey";
import GatewayActivity from "@components/components/GatewayActivity";
import { Inter } from "next/font/google";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Alert from "@components/components/Shared/Alert";
import type { RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { deleteAlert } from "@components/redux/reducers/notificationSlice";
import StatsCardsWrapper from "@components/components/Cards/StatsCardsWrapper";
import { setUserToken } from "@components/redux/reducers/userSlice";
import OngoingCallsIn from "@components/components/GatewayActivity/OngoingCallsIn";
import OngoingCallsOut from "@components/components/GatewayActivity/OngoingCallsOut";
import ConcurrentCalls from "@components/components/GatewayActivity/ConcurrentCalls";
import USSDNetworksPieChart from "@components/components/USSD/USSDNetworksPieChart";
import USSDDialsPieChart from "@components/components/USSD/USSDDialsPieChart";
import GatewayDoughnut from "@components/components/GatewayActivity/GatewayDoughnut";
import OnlineAgents from "@components/components/GatewayActivity/OnlineAgents";
const inter = Inter({ subsets: ["latin"] });

const Navbar = dynamic(() => import("@components/components/Shared/Navbar"), {
  ssr: false,
});
export default function Home() {
  const { alerts, show } = useSelector(
    (state: RootState) => state.notification
  );
  const dispatch = useDispatch();



  const handleDeleteAlert = (e: number) => {
    dispatch(deleteAlert(e));
  };

  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      // signOut();
    });
  }, []);

  return (
    <div className={inter.className}>
      <Head>
        <title>Dashboard | Mergdata Monitor</title>
      </Head>
      <Navbar />

      <main className="py-[33px] px-[36px]">
        <div className="grid gap-3 z-30 right-5 absolute top-20">
          {show &&
            alerts.map((_, i) => (
              <Alert
                text="Gateway 2 has not seen any recent activity"
                key={i}
                index={i}
                handleDeleteAlert={handleDeleteAlert}
              />
            ))}
        </div>
        <StatsCardsWrapper />

        <section className="flex -mx-2 flex-wrap mt-4">
          <div className="w-full xl:w-1/5 lg:w-1/2 pb-4 px-2">
            <USSDDialsPieChart />
          </div>
          <div className="w-full xl:w-1/5 lg:w-1/2 pb-4 px-2">
            <USSDNetworksPieChart />
          </div>
          <div className="w-full xl:w-[60%] pb-4 px-2">
            <ConcurrentCalls />
          </div>
        </section>

        <section className="flex -mx-4 flex-wrap">
          <div className="w-full xl:w-1/2 pb-4 px-2">
            <OngoingCallsIn />
          </div>
          <div className="w-full xl:w-1/2 pb-4 px-2">
            <OngoingCallsOut />
          </div>
        </section>
        <section className="flex -mx-4 flex-wrap">
          <div className="w-full xl:w-1/4 pb-4 px-2">
            <GatewayDoughnut />
          </div>
          <div className="w-full xl:w-2/5 pb-4 px-2">
            <OnlineAgents />
          </div>
        </section>
      </main>
    </div>
  );
}
