import { CardStatProps, Stats } from "@components/components/Cards/card";
import {
  responsesStats,
  smsStats,
  ussdStats,
  voiceCallStats,
} from "@components/utils/stats";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  stats: [
    {
      name: "Voice Calls",
      ...voiceCallStats,
    },
    {
      name: "SMS",
      ...smsStats,
    },

    {
      name: "USSD",
      ...ussdStats,
    },
    {
      name: "Responses",
      ...responsesStats,
    },
  ] as CardStatProps[],

  iniStats: [
    {
      name: "Voice Calls",
      ...voiceCallStats,
    },
    {
      name: "SMS",
      ...smsStats,
    },

    {
      name: "USSD",
      ...ussdStats,
    },
    {
      name: "Responses",
      ...responsesStats,
    },
  ] as CardStatProps[],
};

export const widgetSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    updateSMS: (state, action: PayloadAction<Stats[]>) => {
      state.stats = state.stats.map((ele: CardStatProps) => {
        if (ele.name === "SMS") {
          return { ...ele, stats: action.payload };
        }
        return ele;
      });
    },
    updateUSSD: (state, action: PayloadAction<Stats[]>) => {
      state.stats = state.stats.map((ele: CardStatProps) => {
        if (ele.name === "USSD") {
          return { ...ele, stats: action.payload };
        }
        return ele;
      });
    },
    updateResponses: (state, action: PayloadAction<Stats[]>) => {
      state.stats = state.stats.map((ele: CardStatProps) => {
        if (ele.name === "Responses") {
          return { ...ele, stats: action.payload };
        }
        return ele;
      });
    },
    updateVoiceCalls: (state, action: PayloadAction<Stats[]>) => {
      state.stats = state.stats.map((ele: CardStatProps) => {
        if (ele.name === "Voice Calls") {
          return { ...ele, stats: action.payload };
        }
        return ele;
      });
    },
    updateVoiceCallsCount: (state, action: PayloadAction<number>) => {
      state.stats = state.stats.map((ele: CardStatProps) => {
        if (ele.name === "Voice Calls") {
          return { ...ele, rate: action.payload };
        }
        return ele;
      });
    },

    clearStats: (state) => {
      state.stats = state.iniStats;
    },
  },
});

export const {
  updateResponses,
  updateSMS,
  updateUSSD,
  updateVoiceCalls,
  clearStats,
  updateVoiceCallsCount
} = widgetSlice.actions;

export default widgetSlice.reducer;
