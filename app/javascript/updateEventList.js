function updateEventList(clickedDate) {
  fetch(`/events/date_events?date=${clickedDate}`)
  .then(response => response.json())
  .then(data => {
    // 成功した場合、データを処理
    const listContainer = document.querySelector('.list-container ul');
    listContainer.innerHTML = ''; // 既存のリストアイテムをクリア
    data.forEach(event => {
      // 取得したイベントごとに<li>要素を作成し、リストに追加
      const li = document.createElement('li');

      // イベント名を表示するためのdiv要素を作成
      const eventNameDiv = document.createElement('div');
      eventNameDiv.textContent = event.name; // イベントの名前を設定
      li.appendChild(eventNameDiv); // <li>要素にイベント名を追加

      // 期間を表示するためのdiv要素を作成
      const dateDiv = document.createElement('div');
      dateDiv.textContent = `${formatDate(event.start_date)}〜${formatDate(event.end_date)}`;
      li.appendChild(dateDiv); // <li>要素に期間を追加
          
      // <li>要素をリストコンテナに追加
      listContainer.appendChild(li);

      // ここにdata-属性を追加
      li.setAttribute('data-event-id', event.id);
      li.setAttribute('data-event-name', event.name);
      li.setAttribute('data-event-start-date', event.start_date);
      li.setAttribute('data-event-end-date', event.end_date);
    });
    
  })
  .catch(error => console.error('Error:', error));
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ja-JP', options);
};