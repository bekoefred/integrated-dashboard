import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { renderLegendText } from "@components/utils/renderLegendText";
import CustomizedLabel from "../Chart/CustomizedLabel";
const USSDLineChart = () => {
  const data = [
    {
      name: "Mon",
      ivr: 10,
      ussd: 20,
      short: 80,
    },
    {
      name: "Tue",
      ivr: 30,
      ussd: 60,
      short: 50,
    },
    {
      name: "Wed",
      ivr: 50,
      ussd: 40,
      short: 80,
    },
    {
      name: "Thur",
      ivr: 70,
      ussd: 80,
      short: 20,
    },
    {
      name: "Fri",
      ivr: 20,
      ussd: 10,
      short: 0,
    },
    {
      name: "Sat",
      ivr: 40,
      ussd: 70,
      short: 80,
    },
    {
      name: "Sun",
      ivr: 60,
      ussd: 80,
      short: 30,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={600}
        data={data}
        margin={{
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" horizontal={false} />
        <XAxis
          dataKey="name"
          axisLine={{
            stroke: "rgba(0, 0, 0, 0.5)",
            strokeWidth: 2,
          }}
          tick={{
            fill: "#333333",
            fontSize: "12",
          }}
          tickLine={false}
        />
        <YAxis domain={[0, "dataMax + 10"]} hide={true} />
        <Tooltip />
        <Legend
          align="left"
          verticalAlign="top"
          iconType="rect"
          formatter={renderLegendText}
        />
        <Line
          type="monotone"
          dataKey="ussd"
          name="USSD Code (Survey)"
          stroke="#C4652B"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          label={(props) => (
            <CustomizedLabel
              x={props.x}
              y={props.y}
              stroke={props.stroke}
              value={props.value}
            />
          )}
        />
        <Line
          strokeWidth={2}
          type="monotone"
          name="IVR(Survey)"
          dataKey="ivr"
          stroke="#0E9CFF"
          label={(props) => (
            <CustomizedLabel
              x={props.x}
              y={props.y}
              stroke={props.stroke}
              value={props.value}
            />
          )}
        />
        <Line
          strokeWidth={2}
          type="monotone"
          dataKey="short"
          name="Shortcode Service"
          stroke="#F36FBA"
          label={(props) => (
            <CustomizedLabel
              x={props.x}
              y={props.y}
              stroke={props.stroke}
              value={props.value}
            />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default USSDLineChart;
