import { dataArray } from "@components/utils/ongoing-calls";
import { renderLegendText } from "@components/utils/renderLegendText";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Column } from "react-table";
import OngoingCallsTable from "../GatewayActivity/OngoingCallsTable";

const MobileDevices = () => {
  const data = [
    {
      successful: 15,
      progress: 10,
      stalled: 0,
      responses: 10,
    },
    {
      successful: 10,
      progress: 5,
      stalled: 0,
      responses: 10,
    },
    {
      successful: 20,
      progress: 7,
      stalled: 0,
      responses: 10,
    },
    {
      successful: 10,
      progress: 15,
      stalled: 0,
      responses: 15,
    },
    {
      successful: 10,
      progress: 25,
      stalled: 0,
      responses: 4,
    },
    {
      successful: 28,
      progress: 0,
      stalled: 2,
      responses: 3,
    },
    {
      successful: 38,
      progress: 2,
      stalled: 0,
      responses: 2,
    },
    {
      successful: 39,
      progress: 20,
      stalled: 0,
      responses: 2,
    },
    {
      successful: 0,
      progress: 2,
      stalled: 0,
      responses: 15,
    },
    {
      successful: 40,
      progress: 15,
      stalled: 0,
      responses: 2,
    },
    {
      successful: 2,
      progress: 10,
      stalled: 0,
      responses: 20,
    },
    {
      successful: 30,
      progress: 5,
      stalled: 0,
      responses: 5,
    },

    {
      successful: 15,
      progress: 25,
      stalled: 0,
      responses: 4,
    },

    {
      successful: 0,
      progress: 0,
      stalled: 2,
      responses: 10,
    },

    {
      successful: 38,
      progress: 2,
      stalled: 0,
      responses: 4,
    },

    {
      successful: 23,
      progress: 1,
      stalled: 1,
      responses: 8,
    },

    {
      successful: 4,
      progress: 1,
      stalled: 0,
      responses: 1,
    },

    {
      successful: 1,
      progress: 2,
      stalled: 0,
      responses: 15,
    },
    {
      successful: 38,
      progress: 15,
      stalled: 0,
      responses: 4,
    },

    {
      successful: 4,
      progress: 2,
      stalled: 0,
      responses: 17,
    },

    {
      successful: 38,
      progress: 0,
      stalled: 2,
      responses: 9,
    },

    {
      successful: 25,
      progress: 2,
      stalled: 0,
      responses: 8,
    },

    {
      successful: 10,
      progress: 1,
      stalled: 0,
      responses: 16,
    },

    {
      successful: 30,
      progress: 2,
      stalled: 0,
      responses: 15,
    },

    {
      successful: 30,
      progress: 0,
      stalled: 0,
      responses: 12,
    },
    {
      successful: 28,
      progress: 2,
      stalled: 0,
      responses: 4,
    },
    {
      successful: 18,
      progress: 1,
      stalled: 0,
      responses: 4,
    },
    {
      successful: 38,
      progress: 2,
      stalled: 0,
      responses: 2,
    },
    {
      successful: 19,
      progress: 1,
      stalled: 0,
      responses: 10,
    },

    {
      successful: 39,
      progress: 1,
      stalled: 0,
      responses: 3,
    },

    {
      successful: 9,
      progress: 0,
      stalled: 2,
      responses: 10,
    },
  ];

  const columnsArray: Column[] = [
    {
      Header: "Originator",
      accessor: "col1",
    },
    {
      Header: "Gateway",
      accessor: "col2",
    },
    {
      Header: "Status",
      accessor: "col3",
    },
    {
      Header: "Acct Assigned",
      accessor: "col4",
    },
    {
      Header: "Duration",
      accessor: "col5",
    },
  ];

  return (
    <div className="py-5 px-[19px] rounded-[5px] border border-card-border shadow-card-shadow">
      <h3 className="font-semibold  px-[19px] text-app-blue leading-[19px]">
        Mobile Devices Activity Stream
      </h3>
      <div className="w-full   mt-5">
        {/* <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={600}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              interval={5}
              tick={{
                fill: "#828282",
                fontSize: 12,
              }}
            
            />
            <YAxis
              tickLine={false}
              domain={[0, "dataMax"]}
              hide={true}
              tick={{
                fontSize: 12,
                fill: "#828282",
              }}
            />
            <Tooltip />
            <Legend
              align="left"
              verticalAlign="top"
              iconType="rect"
              formatter={renderLegendText}
           
            />
            <Bar
              name="Sync stalled"
              dataKey="stalled"
              stackId="a"
              fill="#FF3F4C"
            />
            <Bar
              name="Sync in progress"
              dataKey="progress"
              stackId="a"
              fill="#FFB72B"
            />
            <Bar
              name="Synced successfully"
              dataKey="successful"
              stackId="a"
              fill="#1ABC00"
            />
            <Bar
              name="Responses"
              dataKey="responses"
              stackId="a"
              fill="#D9D9D9"
            />
          </BarChart>
        </ResponsiveContainer> */}

        <OngoingCallsTable columns={columnsArray} data={dataArray} />
      </div>
    </div>
  );
};

export default MobileDevices;
