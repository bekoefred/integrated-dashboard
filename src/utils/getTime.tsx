import { IClockVar } from "@components/components/Shared/shared";

var clockVar: IClockVar = {
  d: "",
  dt: "",
  mth: "",
  y: "",
  h: "",
  m: "",
  s: "",
};

export function getTime(): string {
  let currentTime: Date = new Date();
  clockVar.y = currentTime.getFullYear();
  clockVar.mth = currentTime.getMonth();
  clockVar.dt = currentTime.getDate();
  clockVar.d = currentTime.getDay();
  clockVar.h = currentTime.getHours();
  clockVar.m = currentTime.getMinutes();
  clockVar.s = currentTime.getSeconds();
  setTimeout(getTime, 1000);
  if (clockVar.h < 10) {
    clockVar.h = "0" + clockVar.h;
  }
  if (clockVar.m < 10) {
    clockVar.m = "0" + clockVar.m;
  }
  if (clockVar.s < 10) {
    clockVar.s = "0" + clockVar.s;
  }

  var monthsMin: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var daysMin: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var time: string = clockVar.h + ":" + clockVar.m;
  time =
    daysMin[clockVar.d] +
    " " +
    clockVar.dt +
    nth(clockVar.dt) +
    " " +
    monthsMin[clockVar.mth] +
    " " +
    time;

  function nth(n: number): string {
    return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
  }

  return time;
}
