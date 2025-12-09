import { FC, useEffect, useState } from "react";
import { IVoiceCallsActivityCardProps, StatCardProps, Stats } from "./card";
import { TrendingUp } from "@components/assets/svgs/TrendingUp";
import { formatSnake } from "@components/utils/formatSnake";
import { formatNumber } from "@components/utils/formatNumber";
import { useSockets } from "../../../context/socket.context";

export const VoiceCallsActivityCard = () => {
	const { gatewayStats } = useSockets();

	let stats = gatewayStats.get('total');

	return (
		<div
			className={`border border-card-border shadow-card-shadow px-4 py-5  rounded-[5px] xl:mb-0 mb-2 flex-[1_1_auto_!important]`}
		>
			<p className="text-app-gray-2 tracking-[-0.15px] mb-3">Voice Calls</p>
			{
				stats &&
				<div className="md:flex justify-between">
					<div className="xl:w-[150px] flex md:flex-col xl:items-start md:mb-0 mb-5  justify-between">
						<p className="text-app-blue text-xs tracking-[-0.15px] font-semibold block ">
							Ongoing
						</p>
						<span
							className={`text-app-green-1 tracking-[-0.15px] leading-5 text-xs flex items-center font-semibold`}
						>
							{(stats.incoming_current ?? 0) + (stats.outgoing_current ?? 0)} <TrendingUp fill="#219653" className="ml-[5px]" />
						</span>
					</div>
					<div
						className={`flex justify-evenly xl:ml-0 ml-auto w-full call-stats-row`}
					>
						<span className={` px-6`}>
							<p className="text-xs text-app-gray-1 tracking-[-0.15px] leading-5  font-medium">
								Incoming Current
							</p>
							<p
								className={`text-black font-semibold leading-[34px] tracking-[-0.15px] text-[28px]`}
							>
								{stats.incoming_current}
							</p>
						</span>
						<span className={` px-6`}>
							<p className="text-xs text-app-gray-1 tracking-[-0.15px] leading-5  font-medium">
								Outgoing Current
							</p>
							<p
								className={`text-black font-semibold leading-[34px] tracking-[-0.15px] text-[28px]`}
							>
								{stats.outgoing_current}
							</p>
						</span>

						<span className={` px-6`}>
							<p className="text-xs text-app-gray-1 tracking-[-0.15px] leading-5  font-medium">
								Incoming Total
							</p>
							<p
								className={`text-black font-semibold leading-[34px] tracking-[-0.15px] text-[28px]`}
							>
								{stats.incoming}
							</p>
						</span>
						<span className={` px-6`}>
							<p className="text-xs text-app-gray-1 tracking-[-0.15px] leading-5  font-medium">
								Outgoing Total
							</p>
							<p
								className={`text-black font-semibold leading-[34px] tracking-[-0.15px] text-[28px]`}
							>
								{stats.outgoing}
							</p>
						</span>
					</div>
				</div>
			}
		</div>
	);
};
