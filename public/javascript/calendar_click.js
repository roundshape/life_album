import { loadEvents } from './loadEvents.js';

// カレンダー操作
$(document).ready(function() {
  // カレンダーのコンテナ（またはその他の静的な親要素）に対してイベント委譲を設定
  $('#calendar').on('click', '.event-icon', function(e) {
    const clickedDate = e.target.getAttribute('data-date');

    // 日付をフォーマットして表示
    const displayDate = new Date(clickedDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = displayDate.toLocaleDateString('ja-JP', options);

    // タイトルに日付を設定
    document.querySelector('.list-container .title').textContent = `${formattedDate}`;

    // Ajaxリクエストを送信
    loadEvents(clickedDate); 
  });
});
