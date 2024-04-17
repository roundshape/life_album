export async function loadEvents(clickedDate) {
  try {
    const response = await fetch(`/events/date_events?date=${clickedDate}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    const listContainer = document.querySelector('.list-container ul');
    listContainer.innerHTML = '';
    data.forEach(event => {
      const li = document.createElement('li');
      const eventNameDiv = document.createElement('div');
      eventNameDiv.textContent = event.name;
      li.appendChild(eventNameDiv);

      const dateDiv = document.createElement('div');
      dateDiv.textContent = `${formatDate(event.start_date)}〜${formatDate(event.end_date)}`;
      li.appendChild(dateDiv);

      listContainer.appendChild(li);

      li.setAttribute('data-event-id', event.id);
      li.setAttribute('data-event-name', event.name);
      li.setAttribute('data-event-start-date', event.start_date);
      li.setAttribute('data-event-end-date', event.end_date);
    });
  } catch (error) {
    console.error('Error:', error);
    // エラー処理をここに記述する
    // 例えば、ユーザーにエラーメッセージを表示するなど
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ja-JP', options);
};