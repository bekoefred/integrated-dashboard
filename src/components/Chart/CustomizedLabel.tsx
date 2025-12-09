import { FC } from "react";

type CustomizedLabelProps = {
  x: string;
  y: string;
  stroke: string;
  value: string;
  dx?: number;
};

const CustomizedLabel: FC<CustomizedLabelProps> = ({
  x,
  y,
  stroke,
  value,
  dx = 0,
}) => {
  return (
    <text
      x={x}
      y={y}
      dy={-4}
      dx={dx}
      fill={stroke}
      fontSize={10}
      fontWeight={500}
      textAnchor="middle"
    >
      {value}
    </text>
  );
};
export default CustomizedLabel;
