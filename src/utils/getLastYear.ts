export function getLastYear() {
  var currentDate = new Date();

  var year = currentDate.getFullYear() - 1;
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
