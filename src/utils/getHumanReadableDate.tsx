export function getHumanReadableDate(date: Date | null) {
  let currentDate = date ? date : new Date();
  var weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var weekday = weekdayNames[currentDate.getDay()];

  var month = monthNames[currentDate.getMonth()];

  var day = currentDate.getDate();
  var suffix = getDaySuffix(day);
  var formattedDay = day + suffix;

  var year = currentDate.getFullYear();

  var formattedDate = weekday + ", " + month + " " + formattedDay + ", " + year;

  function getDaySuffix(day: any) {
    if (day >= 11 && day <= 13) {
      return "th";
    }

    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return formattedDate;
}
