const updateCalendar = function(event, direction) {
  event.preventDefault();
  var month = event.target.getAttribute("data-month");
  fetch(`/events/nav_month?month=${month}&direction=${direction}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("calendar").innerHTML = data.calendarHtml;

      // <time> 要素の更新
      const timeElement = document.querySelector(".calendar-heading > time");
      timeElement.setAttribute("datetime", `${data.currentYear}-${data.nextMonth.slice(5, 7)}`);
      timeElement.innerHTML = `${data.currentMonthName} ${data.currentYear}`;

      const nextMonthFormatted = new Date(data.nextMonth).toISOString().slice(0, 10);
      document.getElementById("next-month").setAttribute("data-month", nextMonthFormatted);

      //if (document.getElementById("today")) {
      //  document.getElementById("today").setAttribute("data-month", nextMonthFormatted);
      //}

      const previousMonthFormatted = new Date(data.previousMonth).toISOString().slice(0, 10);
      document.getElementById("previous-month").setAttribute("data-month", previousMonthFormatted);
    });
};

const calendarNavigationHandler = function() {
  ["next-month", "previous-month", "today"].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("click", function(event) {
        updateCalendar(event, id);
      });
    }
  });
};

document.addEventListener("turbo:load", calendarNavigationHandler);
