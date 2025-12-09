export function getBeginDate(): string {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 3);

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  var day = currentDate.getDate();

  var formattedDate =
    year +
    "-" +
    month.toString().padStart(2, "0") +
    "-" +
    day.toString().padStart(2, "0");

  return formattedDate;
}
