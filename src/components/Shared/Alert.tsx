import { Cancel } from "@components/assets/svgs/Cancel";
import { Error } from "@components/assets/svgs/Error";
import { FC } from "react";
type AlertProps = {
  handleDeleteAlert: (deleteAlert: number) => void;
  index: number;
  text: string;
};

const Alert: FC<AlertProps> = ({ handleDeleteAlert, index, text }) => {
  return (
    <div
      key={index}
      className={`bg-white rounded-[6px] border
       border-card-border flex justify-center items-center w-fit pr-4   z-30 shadow-nav-shadow
        `}
    >
      <div className="bg-app-red-1 py-[18px] px-[16px] rounded-tl-[6px] rounded-bl-[6px]">
        <Error fill="white" />
      </div>
      <span className="p-4 text-xs">{text}</span>
      <Cancel
        className="block cursor-pointer"
        onClick={() => handleDeleteAlert(index)}
      />
    </div>
  );
};

export default Alert;
