const event_dialog_click = function() {
  const modal = document.getElementById('modal');

  const form = document.getElementById('eventForm');

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
          // updateCalendarForCurrentMonth はもはや必要ありません。代わりに updateCalendar を直接使用します。
          // ここで event と direction を省略または null を渡します。
          updateCalendar(null, null, currentMonth);
        } else if (data.status === 'error') {
          // エラーメッセージを表示
          alert(`エラー: ${data.errors.join(', ')}`);
        }
      })
      .catch(error => {
        error.json().then(errData => {
          alert(`エラー: ${errData.errors.join(', ')}`);
        });
      });
    });
  }
};

document.addEventListener("turbo:load", event_dialog_click);
document.addEventListener("turbo:render", event_dialog_click);
