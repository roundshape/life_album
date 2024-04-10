const updateCalendar = function(event, direction, targetMonth = null) {
  if (event) event.preventDefault();
  var month;

  // targetMonthが指定されている場合はそれを使用し、そうでない場合はイベントから月を取得
  if (targetMonth) {
    month = targetMonth;
  } else {
    month = event.target.getAttribute("data-month");
  }
  
  // directionがnullまたはundefinedの場合、URLに含めない
  let url = `/events/nav_month?month=${month}`;
  if (direction) {
    url += `&direction=${direction}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.getElementById("calendar").innerHTML = data.calendarHtml;
      // <time> 要素とナビゲーションボタンの更新処理をここに追加
      updateCalendarNavigation(data);
    });
};

// カレンダーナビゲーションの更新処理を分離
function updateCalendarNavigation(data) {
  const timeElement = document.querySelector(".calendar-heading > time");
  timeElement.setAttribute("datetime", data.currentMonth);
  timeElement.innerHTML = `${data.currentMonthName} ${data.currentYear}`;

  const nextMonthFormatted = new Date(data.nextMonth).toISOString().slice(0, 10);
  document.getElementById("next-month").setAttribute("data-month", nextMonthFormatted);

  const previousMonthFormatted = new Date(data.previousMonth).toISOString().slice(0, 10);
  document.getElementById("previous-month").setAttribute("data-month", previousMonthFormatted);
}


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
