import { loadEvents } from './loadEvents.js';

// カレンダー操作
$(document).ready(function() {
  // カレンダーのコンテナ（またはその他の静的な親要素）に対してイベント委譲を設定
  $('#calendar').on('click', '.event-icon', async function(e) {
    const clickedDate = e.target.getAttribute('data-date');

    // 日付をフォーマットして表示
    const displayDate = new Date(clickedDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = displayDate.toLocaleDateString('ja-JP', options);

    // タイトルに日付を設定
    const titleElement = document.querySelector('.list-container .title');
    titleElement.textContent = `${formattedDate}`;
    titleElement.setAttribute('data-date', clickedDate); // ここで日付を保存

    // Ajaxリクエストを送信
    await loadEvents(clickedDate); 
  });
});
