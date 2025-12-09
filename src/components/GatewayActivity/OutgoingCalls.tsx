import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Dropdown from "../Shared/Dropdown";
import { Inter } from "next/font/google";
import { filters } from "@components/utils/full-filters-list";

const inter = Inter({ subsets: ["latin"] });

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const OutgoingCalls = () => {
  const data = {
    labels: ["General messages", "Weather forecast", "Market Information"],
    datasets: [
      {
        label: "Outgoing Calls",
        data: [40, 30, 30],
        backgroundColor: ["#2F80ED", "#59129A", "#F2994A"],
        borderColor: ["#2F80ED", "#59129A", "#F2994A"],
        borderWidth: 1,
        pointRadius: 1,
      },
    ],
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart: any) {
      const { ctx } = chart;
      const xCoor = chart.getDatasetMeta(0).data[0].x;
      const yCoor = chart.getDatasetMeta(0).data[0].y;
      ctx.save();
      ctx.font = `normal 10px ${inter.style.fontFamily}`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Outgoing Calls", xCoor, yCoor - 5);

      ctx.font = `bolder 18px ${inter.style.fontFamily}`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText("10000", xCoor, yCoor + 15);
    },
  };

  return (
    <div className="py-5  rounded-[5px] border border-card-border shadow-card-shadow xl:mb-0 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold px-[19px] text-app-blue leading-[19px]">
          Outgoing Calls
        </h3>
        {/* <Dropdown text={false}  filters={filters}/> */}
      </div>
      <div className="w-full h-[300px]  mt-5 mx-auto">
        <Doughnut data={data} options={options} plugins={[textCenter]} />
      </div>
    </div>
  );
};

export default OutgoingCalls;

export const options: any = {
  center: ["50%", "50%"],
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
  responsive: true,
  maintainAspectRatio: true,
};
