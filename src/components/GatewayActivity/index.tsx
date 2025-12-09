import OngoingCalls from "./OngoingCallsIn";
import OutgoingCalls from "./OutgoingCalls";
import ConcurrentCalls from "./ConcurrentCalls";
import Dropdown from "../Shared/Dropdown";
import OngoingCallsIn from "./OngoingCallsIn";
import OngoingCallsOut from "./OngoingCallsOut";

const index = () => {
  return (
    <div className="w-full xl:mb-0 mb-6">
      {/* <div className="md:flex block mb-[21px] justify-between items-center"> */}
        {/* <h2 className="text-[22px] font-medium leading-[100%]">
          Ongoing Voice Gateway Activities
        </h2> */}
        {/* <p className="text-app-red-1 text-sm font-semibold text-center ">
          No recent activity: Gateway 1, Gateway 2{" "}
        </p>
        <div className=""></div> */}
      {/* </div> */}
      {/* xl:grid-cols-[45%_30%_25%] */}
      <div className="xl:grid block grid-cols-2 gap-4 mb-[21px]">
      </div>
      <div className="xl:grid block grid-cols-2 gap-4">
      </div>
    </div>
  );
};

export default index;
