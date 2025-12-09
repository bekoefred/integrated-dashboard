import { dataArray } from "@components/utils/ongoing-calls";
import { useSockets } from "../../../context/socket.context";
import { useEffect, useState } from "react";
import { OngoingCall } from "../Cards/card";

const OngoingCallsOut = () => {
	const { outCallsState } = useSockets();

	return (
		<div className="py-5 px-[19px] rounded-[5px] border border-card-border shadow-card-shadow xl:mb-0 mb-6">
			<h3 className="font-semibold text-app-blue leading-[19px]">
				Outgoing Calls
			</h3>
			<div className="w-[100%] h-[400px] overflow-y-auto overflow-x-hidden  mt-5">
				<table className="w-full ongoing-calls-table">
					<thead className="text-xs bg-app-gray-3  font-normal text-white">
						<tr>
							<th>#</th>
							{/* <th>Origination</th> */}
							<th>Gateway</th>
							<th>Account</th>
							<th>Status</th>
							<th>Duration</th>
							<th>~</th>
						</tr>
					</thead>
					<tbody className="text-[11px] ">
						{Array.from(outCallsState.values())
							.reverse()
							.map((row, i) => (
								<tr
									data-id={row.call_uuid}
									key={i}
									className="hover:bg-app-gray-6"
								>
									<td>{i + 1}</td>
									{/* <td>{row.originator}</td> */}
									<td>{row.gateway}</td>
									<td>{row.account}</td>
									<td>{row.call_status}</td>
									<td>
										{(row.call_status_id == 4) ? (new Date((Date.now() - row.start_time)).toISOString().slice(14, 19)) : "--"}
									</td>
									<td>
										{ row.comment ?? ""}
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default OngoingCallsOut;
