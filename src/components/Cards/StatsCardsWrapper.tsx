import { TrendingUp } from "@components/assets/svgs/TrendingUp";
import { StatCard } from "./StatCard";
import { FC, ReactNode, Suspense, useEffect, useState } from "react";
import { formatSnake } from "@components/utils/formatSnake";
import { formatNumber } from "@components/utils/formatNumber";
import {
  CardStatProps,
  Stats,
  StatsCardsWrapperProps,
  StatsProps,
} from "./card";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@components/redux/store";
import {
  updateResponses,
  updateSMS,
  updateUSSD,
  updateVoiceCalls,
  updateVoiceCallsCount,
} from "@components/redux/reducers/widgetsSlice";
import { useSockets } from "../../../context/socket.context";
import { VoiceCallsActivityCard } from "./VoiceCallsActivityCard";
import { SMSCard } from "./SMSCard";
import { USSDCard } from "./USSDCard";
import { ResponsesCard } from "./ResponsesCard";
import { MERGDATA_API } from "../../../config/default";

const StatsCardsWrapper: FC<StatsCardsWrapperProps> = ({ token }) => {
  const { stats } = useSelector((state: RootState) => state.widgets);

  return (
    <section className="xl:flex flex-wrap block gap-2">
      <Suspense fallback={<div>loading...</div>}>
        <VoiceCallsActivityCard/>
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <USSDCard/>
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <SMSCard />
      </Suspense>
      <Suspense fallback={<div>loading...</div>}>
        <ResponsesCard/>
      </Suspense>
    </section>
  );
};

export default StatsCardsWrapper;