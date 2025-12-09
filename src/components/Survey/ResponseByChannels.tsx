import { GetServerSideProps } from "next";
import Dropdown from "../Shared/Dropdown";
import { filters } from "@components/utils/full-filters-list";

type Response = {
  name: string;
  percentage: string;
  color: string;
  value: string;
};
const ResponseByChannels = () => {
  const channels: Response[] = [
    {
      name: "IVR",
      percentage: "15%",
      color: "bg-[#7B61FF]",
      value: "w-[15%]",
    },
    {
      name: "USSD Code",
      percentage: "15%",
      color: "bg-[#1ABC00]",
      value: "w-[15%]",
    },
    {
      name: "Web",
      percentage: "20%",
      color: "bg-[#FF3F4C]",
      value: "w-[20%]",
    },
    {
      name: "Quiz",
      percentage: "10%",
      color: "bg-[#CF9422]",
      value: "w-[10%]",
    },
    {
      name: "Survey App",
      percentage: "40%",
      color: "bg-[#CF22C8]",
      value: "w-[40%]",
    },
    {
      name: "Education",
      percentage: "0%",
      color: "bg-[#7B61FF]",
      value: "w-[0%]",
    },
  ];
  return (
    <div className="py-5 px-[19px] rounded-[5px] border border-card-border shadow-card-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-app-blue leading-[19px]">
          Response by Channels
        </h3>
      </div>
      <div className="w-full h-[300px]  mt-[29px]">
        {channels.map((ele, i) => (
          <div key={i} className="mb-5">
            <div className="flex text-xs justify-between">
              <p>{ele.name}</p>
              <p className="font-semibold">{ele.percentage}</p>
            </div>
            <div className="w-full bg-progress-bar-bg rounded-full h-2.5 ">
              <div
                className={`${ele.color} h-2.5 rounded-full ${ele.value}`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseByChannels;
