import { getBeginDate } from "./getBeginDate";
import { getEndDate } from "./getEndDate";
import { getLastYear } from "./getLastYear";
import { getThisMonth } from "./getThisMonth";
import { getThisWeek } from "./getThisWeek";
import { getThisYear } from "./getThisYear";

export const filters = [
  {
    label: (
      <span>
        Default
        <sup className="text-[10px] text-app-gray-1">
          ({getBeginDate()} - {getEndDate()})
        </sup>
      </span>
    ),
    value: `${getBeginDate()} 00:00:00`,
  },
  {
    label: "Real time",
    value: "real_time",
  },
  {
    label: "Today",
    value: `${getEndDate()} 00:00:00`,
  },
  {
    label: "This Week",
    value: `${getThisWeek()} 00:00:00`,
  },
  {
    label: "This Month",
    value: `${getThisMonth()} 00:00:00`,
  },
  {
    label: "This year",
    value: `${getThisYear()} 00:00:00`,
  },
  {
    label: "Last year",
    value: `${getLastYear()} 00:00:00`,
  },

  {
    label: "All time",
    value: "1970-01-01 00:00:00",
  },

  {
    label: "Custom Range",
    value: "custom_range",
  },
];
