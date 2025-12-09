import { filters } from "@components/utils/full-filters-list";
import Dropdown from "../Shared/Dropdown";
import SMS from "./SMS";

const index = () => {


  return (
    <div className="">
      <div className="flex mb-[3px] justify-between ">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-[22px] font-medium leading-[100%]">SMS</h2>
          {/* <Dropdown text={false} filters={filters} /> */}
        </div>
      </div>
      <SMS />
    </div>
  );
};

export default index;
