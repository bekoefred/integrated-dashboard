import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { useSockets } from "../../../context/socket.context";
import { Inter } from "next/font/google";
import { Chart } from "chart.js/dist";

ChartJS.register(ArcElement, Tooltip, Legend);

const inter = Inter({ subsets: ["latin"] });

const GatewayDoughnut = () => {
  const { gatewayStats } = useSockets();

  const chartRef = useRef(null);

  let labels: string[] = [
    "Normal",
    "Unreached (No answer)",
    "Unreached (Network)",
    "Unreached (Cancelled)",
    "Unreached (No Credit)",
  ];

  let data: number[] = new Array(5).fill(0);
  const options: any = {
    responsive: true,
    // maintainAspectRatio: true,
    plugins: {
      datalabels: {
        formatter: (value: number, ctx: any) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: number) => {
            sum += data;
          });
          let percentage = (value * 100) / sum + "%";
          return percentage;
        },
        color: "#fff",
        font: {
          size: "16",
          weight: "600",
          family: `${inter.style.fontFamily}`,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          boxHeight: "4",
          color: "#000",
          usePointStyle: true,
          display: "flex",
          font: {
            weight: "500",
            family: `${inter.style.fontFamily}`,
          },
        },
      },
      tooltip: {
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        titleFont: {
          family: `${inter.style.fontFamily}`,
        },
        bodyFont: {
          family: `${inter.style.fontFamily}`,
        },
      },
    },
  };

  gatewayStats.forEach((value: any, key: number) => {
    data[0] =+ value.status_counter[6];
    data[1] =+ value.status_counter[7];
    data[2] =+ value.status_counter[8];
    data[3] =+ value.status_counter[9];
    data[4] =+ value.status_counter[10];
  });


  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;
      let sum = chart.data.datasets[0].data.reduce((a: number, b: number) => {
        return a + b;
      });

      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.save();

      ctx.font = `normal 10px ${inter.style.fontFamily}`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Total # of Calls", xCoor, yCoor - 5);

      ctx.font = `bolder 18px ${inter.style.fontFamily}`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sum, xCoor, yCoor + 15);
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "# of calls",
        data: data,
        backgroundColor: [
          "#1ABC00",
          "#7B61FF",
          "#FF3F4C",
          "#CF9422",
          "#CF22C8",
          "#7B61FF",
        ],
      },
    ],
  };
  return (
    <div className="py-5 pb-7 rounded-[5px] border border-card-border shadow-card-shadow">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold px-[19px] text-app-blue leading-[19px]">
          Voice Call End State Summary
        </h3>
      </div>

      <div className="w-full h-[400px]  mt-3">
        <div className="flex justify-center items-center h-[450px]">
          {chartData.labels.length > 0 ? (
            <Doughnut
              ref={chartRef}
              data={chartData}
              options={options}
              plugins={[textCenter]}
              width={400}
              height={400}
            />
          ) : (
            <p className="pt-5 text-center">loading ... </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatewayDoughnut;
