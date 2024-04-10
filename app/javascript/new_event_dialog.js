const new_event_dialog_click = function() {
  const modal = document.getElementById('new_event_modal');

  const form = document.getElementById('newEventForm');

  if (form) {
    form.addEventListener('submit', function(e) {
      // event.preventDefault(); の呼び出しを条件付きにする
      if (e) e.preventDefault();
      const formData = new FormData(this);
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          // モーダルを非表示
          modal.style.display = 'none';
          // 任意: ページに成功メッセージを表示
          alert('イベントが正常に登録されました。');

          // カレンダーの更新
          // 現在のカレンダー月を取得してupdateCalendarを呼び出す
          const currentMonth = document.querySelector('.calendar-heading > time').getAttribute('datetime');
          // ここで event と direction を省略または null を渡します。
          updateCalendar(null, null, currentMonth);
          const updatedDate = document.querySelector('.list-container .title').getAttribute('data-date');
          if (updatedDate) {
            updateEventList(updatedDate); // イベント一覧を再読み込み
          }
          toggleNewEventModal("none");
        } else if (data.status === 'error') {
          // エラーメッセージを表示
          alert(`エラー: ${data.errors.join(', ')}`);
        }
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        // レスポンスがエラーJSONデータを含む可能性がある場合
        if (error instanceof Response) {
          error.json().then(errData => {
            alert(`エラー: ${errData.errors.join(', ')}`);
          }).catch(jsonError => {
            // JSONパースに失敗した場合、エラーをログに記録
            console.error('Error parsing JSON from error response:', jsonError);
          });
        } else {
          // HTTPエラー以外の場合は、一般的なエラーメッセージを表示
          alert('エラーが発生しました。詳細はコンソールをご確認ください。');
        }
      });
    });
  }
};

document.addEventListener("turbo:load", new_event_dialog_click);
document.addEventListener("turbo:render", new_event_dialog_click);
