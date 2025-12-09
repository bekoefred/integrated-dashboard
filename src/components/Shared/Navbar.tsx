import { useSockets } from "../../../context/socket.context";
import { Notification } from "@components/assets/svgs/Notification";
import { useDispatch, useSelector } from "react-redux";
import { toggleAlerts } from "@components/redux/reducers/notificationSlice";
import { signOut } from "next-auth/react";
import { Logout } from "@components/assets/svgs/Logout";
import { getTime } from "@components/utils/getTime";
import { useEffect, useState } from "react";
import { getLastUpdateTime } from "@components/utils/getLastUpdateTime";
import Link from "next/link";

const loadDateTime = new Date();
const Navbar = () => {
  const { isConnected } = useSockets();
  const dispatch = useDispatch();

  // const [lastUpdate, setLastUpdate] = useState<string>();

  // useEffect(() => {
  //   setLastUpdate(getLastUpdateTime());
  // }, []);

  return (
    <div
      className={`flex justify-between items-center ${isConnected ? "bg-white" : "bg-red-300"
        } sticky top-0 z-50 shadow-nav-shadow py-[14px] px-7 `}
    >
      <div className="flex items-center gap-6">
        <h1 className="text-[21px] font-semibold">Dashboard </h1>
        <Link
          href="/sip-monitor"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          SIP Monitor
        </Link>
      </div>
      <div className="flex items-center">
        <span className="pr-5 border-r-2 border-app-gray-4">
          <Notification
            className="cursor-pointer"
            onClick={() => dispatch(toggleAlerts())}
          />
        </span>
        <div className="pl-4 w-60">
          <p className="text-sm font-semibold">{getTime()}</p>
          <p className="text-xs"><span className="font-semibold">Loaded</span>: {loadDateTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</p>
          {/* <FilterDatePicker setCurrentFilter={handleCurrent} /> */}
        </div>
        <div className="pl-4 ">
          <button onClick={() => signOut()} className="text-sm">
            <Logout width="20" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
