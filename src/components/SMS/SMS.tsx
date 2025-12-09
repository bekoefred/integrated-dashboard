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
import CustomizedLabel from "../Chart/CustomizedLabel";

const SMS = () => {
  const data = [
    {
      name: "General",
      sent: 40,
      delivered: 20,
    },

    {
      name: " Alert",
      sent: 88,
      delivered: 58,
    },
    {
      name: " Campaigns",
      sent: 60,
      delivered: 51,
    },
    {
      name: "Others",
      sent: 38,
      delivered: 8,
    },
  ];
  return (
    <div className="py-5 px-[19px] rounded-[5px] border border-card-border shadow-card-shadow">
      <h3 className="font-semibold text-app-blue leading-[19px]">
        Types of SMS
      </h3>
      <div className="w-full h-[300px] mt-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              tickLine={false}
              dataKey="name"
              tick={{
                fill: "#828282",
                fontSize: 12,
              }}
            />
            <YAxis hide={true} />
            <Tooltip />
            <Legend
              align="left"
              verticalAlign="top"
              iconType="rect"
              formatter={renderLegendText}
            />
            <Bar
              name="Sent messages"
              dataKey="sent"
              fill="#0263FF"
              label={(props) => (
                <CustomizedLabel
                  x={props.x}
                  y={props.y}
                  stroke={props.stroke}
                  value={props.value}
                  dx={13}
                />
              )}
            />
            <Bar
              name="Delivered messages"
              dataKey="delivered"
              fill="#09B800"
              label={(props) => (
                <CustomizedLabel
                  x={props.x}
                  y={props.y}
                  stroke={props.stroke}
                  value={props.value}
                  dx={13}
                />
              )}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SMS;
