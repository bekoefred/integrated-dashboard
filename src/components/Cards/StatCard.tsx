import { stat } from "fs";
import { FC } from "react";
import { StatCardProps } from "./card";
import { TrendingUp } from "@components/assets/svgs/TrendingUp";

export const StatCard: FC<StatCardProps> = ({
  title,
  subtitle,
  rate,
  stats,
  className,
}) => {
  return (
    <div
      className={`border border-card-border shadow-card-shadow px-4 py-5  rounded-[5px] xl:mb-0 mb-2 ${className}`}
    >
      <p className="text-app-gray-2 tracking-[-0.15px] mb-3">{title}</p>
      <div className="md:flex justify-between">
        <div className="xl:w-[150px] flex md:flex-col xl:items-start md:mb-0 mb-5  justify-between">
          <p className="text-app-blue text-xs tracking-[-0.15px] font-semibold block ">
            {subtitle}
          </p>
          <span
            // className={` ${
            //   trend.direction === "up" ? "text-app-green-1" : "text-app-red-1"
            // } tracking-[-0.15px] leading-5 text-xs flex items-center font-semibold`}

            className={`text-app-green-1 tracking-[-0.15px] leading-5 text-xs flex items-center font-semibold`}
          >
            {rate} <TrendingUp fill="#219653" className="ml-[5px]" />
          </span>
        </div>
        {/* grid grid-cols-4 */}
        <div
          className={`flex justify-evenly xl:ml-0 ml-auto
        ${stats[0]?.title.length === 0 ? "w-fit" : "w-full"}
        call-stats-row`}
        >
          {stats.length > 0 ? (
            stats.map((ele, i) => (
              <span
                key={i}
                className={` ${ele.title.length === 0 ? "px-0" : "px-6"}`}
              >
                <p className="text-xs text-app-gray-1 tracking-[-0.15px] leading-5  font-medium">
                  {ele.title}
                </p>
                <p
                  className={`text-black font-semibold leading-[34px] tracking-[-0.15px] text-[28px] ${
                    ele.title.length === 0 ? "xl:mt-[20px] mt-[10px]" : ""
                  }`}
                >
                  {ele.number}
                </p>
              </span>
            ))
          ) : (
            <p className="text-sm">loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};
