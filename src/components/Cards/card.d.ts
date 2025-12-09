import { unique } from 'next/dist/build/utils';
import { ReactNode } from "react";
import { Column } from "react-table";

export interface OngoingCall {
  call_status: string;
  call_status_id: number;
  gateway: string;
  gateway_id: number;
  account: string;
  last_updated: number;
  start_time: number;
  call_uuid: string;
  comment?: null | string;
}

export interface Call {
  gateway_id: number;
  call_status: number;
  direction: number; //0: outgoin, 1: incoming
}

export interface USSDProps {
  contacts: Array;
  counter: number;
  dials: Map<string, any>;
  network: Map<string, any>;
}

export interface ResponseProps {
  counter: number;
  survey_counter: number;
}
export interface SyncProps {
  counter: number;
  organisation_counter: number;
}

export interface ICallEvent {
  a: string;
  g: number;
  i: string;
  s: number;
}

export interface OngoingCallsTableProps {
  columns: Column[];
  data: Columns[];
}

export interface Stats {
  title: string;
  number: string;
}

export interface ICallStatus {
  id: number;
  name: string;
  counter: number;
}

export interface TrendProps {
  svg: ReactNode;
  direction: string;
}

export interface CardStatProps {
  title: string;
  subtitle: string;
  rate: number;
  stats: Stats[];
  name: string;
}

export interface StatsCardsWrapperProps {
  token?: string;
}

export interface Trends {
  svg: React.ReactNode;
  direction: string;
}
export interface StatCardProps {
  title: string;
  subtitle: string;
  rate: number;
  stats: Stats[];
  className?: string;
}
export interface IVoiceCallsActivityCardProps extends StatCardProps {
  title: string;
  subtitle: string;
  rate: number;
  stats: IVoiceCallStat;
  className?: string;
}

export interface IVoiceCallStat {
  incoming_current: number;
  incoming: Map<string, number>;
  outgoing_current: array;
  outgoing: Map<string, number>;
  all: Map<string, number>;
  name: string;
}

export interface IGatewaySum {
  incoming_current: number;
  incoming: number;
  outgoing_current: number;
  outgoing: number;
  all: number;
  name: string;
  status_counter?: Array;
}

export interface StatsProps {
  voiceCallStats?: CardStatProps;
  smsStats?: CardStatProps;
  ussdStats?: CardStatProps;
  responsesStats?: CardStatProps;
}
