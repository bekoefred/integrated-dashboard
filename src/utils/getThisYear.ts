export function getThisYear() {
  var currentDate = new Date();

  var year = currentDate.getFullYear();

  var formattedDate = `${year}-01-01`

  return formattedDate;
}
