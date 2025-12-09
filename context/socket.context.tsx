import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import {
  Call,
  ICallEvent,
  ICallStatus,
  IGatewaySum,
  OngoingCall,
  ResponseProps,
  SyncProps,
  USSDProps,
} from "@components/components/Cards/card";

const CallStatuses = [
  "None",
  "Queued",
  "Started",
  "Ringing",
  "In Progress",
  "Waiting to Retry",
  "Ended",
  "Unreached (No answer)",
  "Unreached (Network)",
  "Unreached (Cancelled)",
  "Unreached (No Credit)",
];

const Gateways = [
  {
    name: "None",
    channel_number: null,
  },
  {
    name: "GoIP",
    channel_number: null
  },
  {
    name: "Voxbeam Outbound",
    channel_number: null
  },
  {
    name: "Plivo Cloud",
    channel_number: null
  },
  {
    name: "Nexmo US",
    channel_number: "+15036789995"
  },
  {
    name: "AfricasTalking Kenya",
    channel_number: "+254711082022"
  },
  {
    name: "MTN Ghana E1 (FS)",
    channel_number: "0242435536"
  },
  {
    name: "MTN Ghana E1 (JSI)",
    channel_number: "0242435537"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0242439876"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0242439877"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0242439879"
  },
  {
    name: "MTN Benin E1",
    channel_number: "7200"
  },
  {
    name: "MTN Benin E1",
    channel_number: "7200"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0242439829"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0242439891"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0596921077"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0596921078"
  },
  {
    name: "MTN Ghana SIP",
    channel_number: "0596921079"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010970"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010971"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010972"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010973"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010974"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010975"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010976"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010977"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010978"
  },
  {
    name: "MTN IVC SIP",
    channel_number: "2522010979"
  },
  {
    name: "MTN Benin SIP",
    channel_number: "22952466969"
  },
  {
    name: "AfricasTalking Tanzania",
    channel_number: "+255699997900"
  },
  {
    name: "AfricasTalking Uganda",
    channel_number: "+256323200807"
  },
  {
    name: "Togocom",
    channel_number: "+22822239260"
  },
  {
    name: "AfricasTalking Nigeria",
    channel_number: "+2342017001219"
  },
  {
    name: "Nexmo Mexico",
    channel_number: "12708452183"
  },
  {
    name: "Nexmo Argentina",
    channel_number: "+541139859538"
  },
  {
    name: "Nexmo Netherlands",
    channel_number: "+3197006521258"
  },
  {
    name: "Twilio US",
    channel_number: "+12569524026"
  }
];

interface Context {
  socket: Socket;
  userID?: string;
  isConnected: boolean;
  setUserID: Function;
  setIsConnected: Function;
  removeCall: Function;
  callEvent: Function;
  setUssdStats: Function;
  outCallsState: Map<string, OngoingCall>;
  inCallsState: Map<string, OngoingCall>;
  gatewayStats: any;
  ussdStats: USSDProps;
  responseStats: ResponseProps;
  syncStats: SyncProps;
}

const socket = io(SOCKET_URL);
let isConnectedAlt = false;
let ongoingCallsIn = new Map();
let ongoingCallsOut = new Map();
let gatewaySummary: Map<string, IGatewaySum> = new Map();

socket.once("connect", () => {
  isConnectedAlt = true;
  console.log("socket connected");

  socket.emit("join room", "mergdata-monitoring");
});

const SocketContext = createContext<Context>({
  socket,
  setUserID: () => false,
  setIsConnected: () => false,
  userID: "",
  isConnected: false,
  removeCall: () => {},
  callEvent: () => {},
  setUssdStats: () => {},
  gatewayStats: new Map(),
  outCallsState: new Map(),
  inCallsState: new Map(),
  responseStats: { counter: 0, survey_counter: 0 },
  syncStats: { counter: 0, organisation_counter: 0 },
  ussdStats: { contacts: [], dials: new Map(), network: new Map(), counter: 0 },
});

function SocketsProvider(props: any) {
  const [userID, setUserID] = useState("");
  const [isConnected, setIsConnected] = useState(isConnectedAlt);

  const [outCallsState, setOutCallsState] = useState(new Map());
  const [inCallsState, setInCallsState] = useState(new Map());
  const [gatewayStats, setGatewayStats] = useState(new Map());
  const [ussdStats, setUssdStats] = useState<USSDProps>({
    contacts: [],
    dials: new Map(),
    network: new Map(),
    counter: 0,
  });
  const [responseStats, setResponseStats] = useState<ResponseProps>({
    counter: 0,
    survey_counter: 0,
  });
  const [syncStats, setSyncStats] = useState<SyncProps>({
    counter: 0,
    organisation_counter: 0,
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected");
      setIsConnected(true);

      socket.emit("join room", "mergdata-monitoring");
    });

    socket.on("disconnect", (msg: any) => {
      console.log("disconnect", msg);
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);


  
  const removeCall = (
    call_uuid: string,
    ongoingCalls: Map<string, OngoingCall>,
    timeout: number = 7000
  ): void => {
    if (ongoingCalls.has(call_uuid)) {
      ongoingCalls.delete(call_uuid);
    }
  };

  const callEvent = (
    data: any,
    ongoingCalls: Map<string, OngoingCall>,
    direction: number = 0
  ): void => {

    let gSum: IGatewaySum;
    let gTotal: IGatewaySum;
    // let sSum: ICallStatus;
    // let sTotal: ICallStatus;

    gSum = gatewaySummary.get(data.g) ?? {
      name: Gateways[data.g].channel_number ?? Gateways[data.g].name,
      all: 0,
      incoming: 0,
      outgoing: 0,
      incoming_current: 0,
      outgoing_current: 0,
      status_counter: new Array(11).fill(0),
    };

    gTotal = gatewaySummary.get("total") ?? {
      name: "All",
      all: 0,
      incoming: 0,
      outgoing: 0,
      incoming_current: 0,
      outgoing_current: 0,
      status_counter: new Array(11).fill(0),
    };

    let call = ongoingCalls.get(data.i);

    if (call) {
      if (call) {
        if (typeof data.s !== "undefined") {
          call.call_status = CallStatuses[data.s];
          call.call_status_id = data.s;
        }

        if (typeof data.ex !== "undefined") {
          call.comment = data.ex;
        }

        if (call.account == null) {
          call.account = data.a;
        }
        call.last_updated = Date.now();

        if (data.s >= 6) {
          if (direction == 0) {
            gSum.incoming_current = Math.max(0, gSum.incoming_current - 1);
            gTotal.incoming_current = Math.max(0, gTotal.incoming_current - 1);
          } else {
            gSum.outgoing_current = Math.max(0, gSum.outgoing_current - 1);
            gTotal.outgoing_current = Math.max(0, gTotal.outgoing_current - 1);
          }

          gSum.status_counter[data.s]++;
          gTotal.status_counter[data.s]++;
          removeCall(data.i, ongoingCalls, 7000);
        }

        gatewaySummary.set("total", gTotal);
        gatewaySummary.set(data.g, gSum);
      }
    } else {
      try {
        if (data.s < 6) {
          ongoingCalls.set(data.i, {
            call_uuid: data.i,
            start_time: parseInt(data.st ?? Date.now()),
            last_updated: Date.now(),
            call_status: CallStatuses[data.s],
            call_status_id: data.s,
            account: data.a ?? null,
            comment: data.ex ?? null,
            gateway_id: data.g,
            gateway: Gateways[data.g].channel_number ?? Gateways[data.g].name,
          });

          gSum.all++;
          gTotal.all++;

          if (direction == 0) {
            gSum.incoming++;
            gTotal.incoming++;

            if (data.s <= 4) {
              gSum.incoming_current++;
              gTotal.incoming_current++;
            }
          } else {
            gSum.outgoing++;
            gTotal.outgoing++;
            if (data.s <= 4) {
              gTotal.outgoing_current++;
              gSum.outgoing_current++;
            }
          }

          gatewaySummary.set("total", gTotal);
          gatewaySummary.set(data.g, gSum);
        }
      } catch (error) {
      }
    }
  };

  useEffect(() => {
    socket.on("out_voice_calls", (data: any) => {
      callEvent(data, ongoingCallsOut, 1);
    });

    socket.on("in_voice_calls", (data: any) => {
      callEvent(data, ongoingCallsIn, 0);
    });
    
    return () => {
      socket.off("out_voice_calls");
      socket.off("in_voice_calls");
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setOutCallsState(() => {
        return new Map(ongoingCallsOut);
      });

      setInCallsState(() => {
        return new Map(ongoingCallsIn);
      });

      setGatewayStats(() => {
        return new Map(gatewaySummary);
      });
    }, 1000);

    const EXPIRY_LIMIT = 10 * 60 * 1000;

    const clInterval = setInterval(()=>{
      
        ongoingCallsIn.forEach((value, key) => {
          if ((Date.now() - value.start_time) > EXPIRY_LIMIT) {
            let data =  {
              d: 0, 
              i: value.call_uuid, 
              s: 6, 
              g: value.gateway_id
            };
            callEvent(data, ongoingCallsIn, 0);
          }
        });
        
        ongoingCallsOut.forEach((value, key) => {
          if ((Date.now() - value.start_time) > EXPIRY_LIMIT) {
            let data =  {
              d: 1, 
              i: value.call_uuid, 
              s: 6, 
              g: value.gateway_id
            };
            callEvent(data, ongoingCallsOut, 1);
          }
        });
    },7000);

    return () => {
      clearInterval(interval);
      clearInterval(clInterval);

    };
  }, []);


  useEffect(() => {
    socket.on("ussd_request", (data: any) => {
      setUssdStats((prev: USSDProps) => {
        let next: USSDProps = prev;

        if (!next.contacts.includes(data.o)) {
          next.contacts.push(data.o);
        }

        let ct = 0;
        if (next.dials.has(data.nm)) {
          ct = next.dials.get(data.nm);
        }
        ct++;
        next.dials.set(data.nm, ct);

        ct = 0;
        if (next.network.has(data.n + " - " + data.cn)) {
          ct = next.network.get(data.n + " - " + data.cn);
        }
        ct++;
        next.network.set(data.n + " - " + data.cn, ct);

        next.counter++;

        return next;
      });
    });

    return () => {
      socket.off("ussd_request");
    };
  }, [setUssdStats]);

  useEffect(() => {
    socket.on("survey_responses", (data: any) => {
      // console.log(data);
      setResponseStats((prev: ResponseProps) => {
        let next: ResponseProps = prev;

        next.counter++;
        next.survey_counter++;
        return next;
      });
    });

    return () => {
      socket.off("survey_responses");
    };
  }, []);

  useEffect(() => {
    socket.on("response_syncs", (data: any) => {
      // console.log(data);
      setSyncStats((prev: SyncProps) => {
        let next: SyncProps = prev;

        next.counter++;
        next.organisation_counter++;
        return next;
      });
    });

    return () => {
      socket.off("response_syncs");
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        userID,
        isConnected,
        setIsConnected,
        removeCall,
        callEvent,
        gatewayStats,
        ussdStats,
        setUssdStats,
        responseStats,
        syncStats,
        inCallsState,
        outCallsState,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
