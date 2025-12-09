import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { useSockets } from "../../../context/socket.context";
import { Inter } from "next/font/google";
import { Chart } from "chart.js/dist";

ChartJS.register(ArcElement, Tooltip, Legend);

const inter = Inter({ subsets: ["latin"] });

const USSDPieChart = () => {
  const { ussdStats } = useSockets();
  const chartRef = useRef(null);
  const ussdCount: number[] = [];
  const labels: string[] = [];

  const options: any = {
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

  ussdStats.dials.forEach((count, label) => {
    ussdCount.push(count);
    labels.push(label);
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
      ctx.fillText("Total # of Dials", xCoor, yCoor - 5);

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
        label: "# of USSD Dials",
        data: ussdCount,
        backgroundColor: [
          "#7B61FF",
          "#1ABC00",
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
          USSD Channel Distribution
        </h3>
      </div>

      <div className="w-full min-h-fit h-[280px]  mt-5">
        <div className="flex justify-center items-center">
          {chartData.labels.length > 0 ? (
            <Doughnut
              ref={chartRef}
              data={chartData}
              options={options}
              plugins={[textCenter]}
            />
          ) : (
            <p className="pt-5 text-center">loading ... </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default USSDPieChart;
