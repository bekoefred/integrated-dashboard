import { dataArray } from "@components/utils/ongoing-calls";
import { useSockets } from "../../../context/socket.context";
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useState } from "react";
import { OngoingCall } from "../Cards/card";

export default function OnlineAgents() {
	const { socket } = useSockets();

	const [onlineAgents, setOnlineAgents] = useState(new Map());

	useEffect(() => {
		socket.on("sip_registrations", (data: any) => {
			setOnlineAgents((prev: Map<string, any>) => {
				const activeAgents = new Map(prev);
				activeAgents.set(data.h, data.rs);
				return activeAgents;
			});
		});
	
		return () => {
		  socket.off("sip_registrations");
		};
	  });
	let c = 1;

	return (
		<div className="py-5 px-[19px] rounded-[5px] border border-card-border shadow-card-shadow xl:mb-0 mb-6">
			<h3 className="font-semibold text-app-blue leading-[19px]">
				Active Agents
			</h3>
			<div className="w-[100%] h-[400px] overflow-y-auto overflow-x-hidden  mt-5">
				<table className="w-full ongoing-calls-table">
					<thead className="text-xs bg-app-gray-3  font-normal text-white">
						<tr>
							<th>#</th>
							<th>Host</th>
							<th>Extention</th>
							<th>User Agent</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody className="text-[11px] ">
						{
						Array.from(onlineAgents.values())
							.map((host, i) => (
								host.map((row: { sip_user: string; user_agent: string; ping_status: string; sip_host: string}, j: number) => (

									<tr
										data-id={row.sip_user}
										key={row.sip_user}
										className="hover:bg-app-gray-6"
									>
										<td>{c++}</td>
										<td>{row.sip_host}</td>
										<td>{row.sip_user}</td>
										<td>{row.user_agent.split("|").splice(1) }</td>
										<td>{row.ping_status}</td>
									</tr>
								))
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
