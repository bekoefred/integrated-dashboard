import React, { FC, useEffect, useRef, useState } from "react";
import { getFormattedDate } from "@components/utils/getFormattedDate";
import DatePicker from "react-datepicker";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import "react-datepicker/dist/react-datepicker.css";
import { Prev } from "@components/assets/svgs/Prev";
import { Next } from "@components/assets/svgs/Next";
import { getHumanReadableDate } from "@components/utils/getHumanReadableDate";

interface IFilterDatePicker {
  setCurrentFilter: (text: string) => void;
}
const FilterDatePicker: FC<IFilterDatePicker> = ({ setCurrentFilter }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const handleSelectedDate = (date: Date | null) => {
    setStartDate(date);
    setCurrentFilter(getFormattedDate(date));
  };
  return (
    <>
      <style jsx global>{`
        .react-datepicker {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className="flex items-center justify-center ">
        <span className="text-sm">Filter:</span>
        <DatePicker
          selected={startDate}
          dateFormat="do MMMM, yyyy"
          onChange={(date) => handleSelectedDate(date)}
          renderCustomHeader={({
            date,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
            decreaseMonth
          }) => (
            <div className="flex justify-between mt-2">
              <button
                className="pl-2"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                <Prev width="25"/>
              </button>
              <p>{getHumanReadableDate(date)}</p>
              <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="pr-2">
                <Next width="25" />
              </button>
            </div>
          )}
        />
      </div>
    </>
  );
};

export default FilterDatePicker;
