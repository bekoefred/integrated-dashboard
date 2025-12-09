import { getEndDate } from "./getEndDate";

export function getFormattedDate(selectedDate: Date | null): string {
  if (selectedDate) {
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let date = selectedDate.getDate();
    var formattedDate = `${year}-${month.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  }

  return getEndDate();
}
