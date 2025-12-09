import { FC, useEffect } from "react";
import { StatCardProps } from "./card";
import { TrendingUp } from "@components/assets/svgs/TrendingUp";
import { unique } from "next/dist/build/utils";
import { useSockets } from "../../../context/socket.context";

export const USSDCard = () => {
	const { ussdStats } = useSockets();

	return (
		<div
			className={`border border-card-border shadow-card-shadow px-4 py-5  rounded-[5px] xl:mb-0 mb-2 flex-[1_1_auto_!important]`}
		>
			<p className="text-app-gray-2 tracking-[-0.15px] mb-3">USSD Dials</p>
			{
				ussdStats &&
				<div className="md:flex justify-between">
					<div className="xl:w-[150px] flex md:flex-col xl:items-start md:mb-0 mb-5  justify-between">
						<p className="text-app-blue text-xs tracking-[-0.15px] font-semibold block ">
							Unique Contacts
						</p>
						<span
							className={`text-app-green-1 tracking-[-0.15px] leading-5 text-xs flex items-center font-semibold`}
						>
							{ussdStats.contacts.length} <TrendingUp fill="#219653" className="ml-[5px]" />
						</span>
					</div>
					<div
						className={`flex justify-evenly xl:ml-0 ml-auto w-fit call-stats-row`}
					>
						<span className="px-0 pt-3">
							<p
								className={`text-black font-semibold leading-[34px] tracking-[-0.15px] text-[34px]`}
							>
								{ussdStats.counter}
							</p>
						</span>
					</div>
				</div>
			}
		</div>
	);
};
