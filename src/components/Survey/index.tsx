import { useEffect, useRef, useState } from "react";
import MobileDevices from "./MobileDevices";
import ResponseByChannels from "./ResponseByChannels";
import { DropdownIcon } from "@components/assets/svgs/DropdownIcon";
import Dropdown from "../Shared/Dropdown";
import { filters } from "@components/utils/full-filters-list";

const index = () => {
  return (
    <div className="">
      <div className="md:flex grid grid-cols-2 mb-[21px] justify-between items-center ">
        <h2 className="text-[22px] font-medium leading-[100%]">Survey</h2>
        <p className="text-app-red-1 text-sm row-start-2 xl:mt-0 mt-4 font-semibold">
          Sync stalled on 10 devices
        </p>
        <div className=""></div>
      </div>
      <div className="grid xl:grid-cols-[60%_40%] grid-cols-1 gap-4">
        {/* <MobileDevices /> */}
        <ResponseByChannels />
      </div>
    </div>
  );
};

export default index;
