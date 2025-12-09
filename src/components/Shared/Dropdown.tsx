import { DropdownIcon } from "@components/assets/svgs/DropdownIcon";
import useComponentVisible from "@components/hooks/useComponentVisible";
import { ReactNode, useRef, useState } from "react";
import { FC } from "react";
import { CurrentFilterProps } from "./shared";

type FilterProps = {
  label: string | ReactNode;
  value: string;
};

type DropdownProps = {
  text: boolean;
  filters: FilterProps[];
  setCurrentFilter: (text: string) => void;
  currentFilter: CurrentFilterProps;
};
const Dropdown: FC<DropdownProps> = ({
  currentFilter,
  text,
  filters,
  setCurrentFilter,
}) => {
  
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);

  return (
    <div className="flex items-center justify-between ">
      {text && <p className="font-light text-sm block">Filter by:</p>}
      <div className="relative ">
        <button
          onClick={() => {
            setIsComponentVisible(true);
          }}
          className="  text-app-blue font-medium   rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center "
          type="button"
        >
          <span className="mr-4"> {currentFilter.label}</span>
          <DropdownIcon fill="black" />
        </button>
        <div
          ref={ref}
          className="bg-white shadow-dropdown-shadow rounded   absolute top-[40px]"
        >
          {isComponentVisible && (
            <ul
              id="filters"
              className=" px-3 text-sm text-gray-700 bg-white w-max cursor-pointer  z-20 relative "
              aria-labelledby="dropdownDefaultButton"
            >
              {filters.map((ele, i) => (
                <li
                  onClick={() => setCurrentFilter(ele.value)}
                  className="text-sm py-2  border-b  border-app-gray-4 "
                  key={i}
                >
                  {typeof ele.label === "string" ? ele.label : "Default"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
