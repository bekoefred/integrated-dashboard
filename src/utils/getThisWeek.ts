export function getThisWeek() {
  var currentDate = new Date();

  var startOfWeek = currentDate.getDate() - currentDate.getDay() + 1;

  var startDate = new Date(currentDate.setDate(startOfWeek));

  var year = startDate.getFullYear();
  var month = startDate.getMonth() + 1;
  var day = startDate.getDate();

  var formattedDate =
    year +
    "-" +
    month.toString().padStart(2, "0") +
    "-" +
    day.toString().padStart(2, "0");

  return formattedDate;
}
