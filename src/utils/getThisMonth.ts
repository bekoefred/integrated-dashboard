export function getThisMonth() {
  var currentDate = new Date();

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;

  var formattedDate =
    year + "-" + month.toString().padStart(2, "0") + "-" + "01";

  return formattedDate;
}
