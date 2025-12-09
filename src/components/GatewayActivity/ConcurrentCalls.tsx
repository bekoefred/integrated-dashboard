import { Incoming } from "@components/assets/svgs/Incoming";
import { Outgoing } from "@components/assets/svgs/Outgoing";
import Dropdown from "../Shared/Dropdown";
import { filters } from "@components/utils/full-filters-list";
import { useSockets } from "../../../context/socket.context";
import { IVoiceCallStat } from "../Cards/card";
import { useEffect, useState } from "react";
import { TrendingUp } from "@components/assets/svgs/TrendingUp";

const ConcurrentCalls = () => {
  const { gatewayStats } = useSockets();

  return (
    <div className="py-5 px-[19px] rounded-[5px] border border-card-border shadow-card-shadow ">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-app-blue leading-[19px]">
          Voice Call Gateway Stats
        </h3>
        {/* <Dropdown text={false} filters={filters} /> */}
      </div>
      <div className="w-full min-h-fit h-[280px] mt-3 text-[12px]">
        <div className="mt-[30px] min-h-fit h-[280px] overflow-auto ">
          <table className="w-full   border-spacing-y-4 border-separate">
            <thead className="bg-white">
              <tr>
                <th className="text-left">Gateway</th>
                <th className="text-center">Current (In)</th>
                <th className="text-center">Current (Out)</th>
                <th className="text-center">Total (In)</th>
                <th className="text-center">Total (Out)</th>
                <th className="">Total</th>
                <th className="text-center">No Answer</th>
                <th className="text-center">Network</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hidden"></tr>
              {Array.from(gatewayStats).map((value: any, key: number) => (
                <tr key={key} className="border-red-500">
                  <td className="border border-card-border font-medium rounded-tl-[5px] rounded-bl-[5px] border-r-0 p-2">
                    {value[1].name ? value[1].name : "Total"}
                  </td>
                  <td className="border border-card-border text-app-green-2 font-semibold  border-r-0 border-l-0 text-center">
                    <span className="flex justify-center items-center ">
                      <Incoming fill="#1ABC00" />
                      <span className="ml-2 w-[30px] ">
                        {value[1].incoming_current}
                      </span>
                    </span>
                  </td>
                  <td className="border border-card-border text-app-red-1 font-semibold  border-r-0 border-l-0 text-center">
                    <span className="flex justify-center items-center ">
                      <Outgoing />
                      <span className="ml-2 w-[30px] ">
                        {value[1].outgoing_current}
                      </span>
                    </span>
                  </td>
                  <td className="border border-card-border text-app-green-2 font-semibold border-r-0 border-l-0 text-center">
                    <span className="flex justify-center items-center ">
                      <Incoming fill="#1ABC00" />
                      <span className="ml-2 w-[30px] ">
                        {value[1].incoming}
                      </span>
                    </span>
                  </td>
                  <td className="border border-card-border text-app-red-1 font-semibold  border-r-0 border-l-0 text-center">
                    <span className="flex justify-center items-center ">
                      <Outgoing />
                      <span className="ml-2 w-[30px] ">
                        {value[1].outgoing}
                      </span>
                    </span>
                  </td>
                  <td className="border border-card-border  border-r-0 border-l-0 text-center">
                    {value[1].all}
                  </td>

                  <td className="border border-card-border  border-r-0 border-l-0 text-center">
                    {Math.round(
                      (value[1].status_counter[7] * 100) / value[1].all
                    )}
                    %
                  </td>
                  <td className="border border-card-border rounded-tr-[5px] rounded-br-[5px] border-l-0 text-center">
                    {Math.round(
                      (value[1].status_counter[8] * 100) / value[1].all
                    )}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConcurrentCalls;
