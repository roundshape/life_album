const edit_event_dialog_click = function() {
  const modal = document.getElementById('edit_event_modal');

  const form = document.getElementById('editEventForm');

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
          alert('イベントが正常に更新されました。');

          // カレンダーの更新
          // 現在のカレンダー月を取得してupdateCalendarを呼び出す
          const currentMonth = document.querySelector('.calendar-heading > time').getAttribute('datetime');
          // ここで event と direction を省略または null を渡します。
          updateCalendar(null, null, currentMonth);
          const updatedDate = document.querySelector('.list-container .title').getAttribute('data-date');
          updateEventList(updatedDate); // イベント一覧を再読み込み
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

document.addEventListener("turbo:load", edit_event_dialog_click);
document.addEventListener("turbo:render", edit_event_dialog_click);

const delete_event_dialog_click = function() {
  document.getElementById('deleteEvent').addEventListener('click', async function() {
    const eventId = this.getAttribute('data-event-id');

    // 写真件数を取得するためのリクエスト
    try {
      const response = await fetch(`/events/${eventId}/photos_count`);
      if (!response.ok) {
        throw new Error('サーバーからの応答が正常ではありません。');
      }
      const data = await response.json();
      const photosCount = data.photosCount; // この属性名はサーバーのレスポンスに依存します

      if (photosCount > 0) {
        // 確認ダイアログの表示
        if (!confirm(`このイベントには${photosCount}件の写真があります。本当にこのイベントを削除してもよろしいですか？`)) {
          return;
        }
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('写真件数の取得中にエラーが発生しました。');
    }

    // サーバーに削除リクエストを送信する
    fetch(`/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      credentials: 'include'
    })
    .then(response => response.json()) // JSONレスポンスの解析
    .then(data => {
      if (data.status === 'success') {
        // 削除成功の処理をここに記述
        alert('イベントが正常に削除されました。');
        // カレンダーの更新
        // 現在のカレンダー月を取得してupdateCalendarを呼び出す
        const currentMonth = document.querySelector('.calendar-heading > time').getAttribute('datetime');
        // ここで event と direction を省略または null を渡します。
        updateCalendar(null, null, currentMonth);
        const updatedDate = document.querySelector('.list-container .title').getAttribute('data-date');
        updateEventList(updatedDate); // イベント一覧を再読み込み
        toggleEditEventModal("none");
      } else {
        // 何らかの理由でdata.statusが'success'以外の場合の処理
        throw new Error('予期せぬレスポンスを受け取りました。');
      }
    })
    .catch(error => {
      console.error('削除処理中にエラーが発生しました:', error);
    });

  });
};

document.addEventListener("turbo:load", delete_event_dialog_click);
document.addEventListener("turbo:render", delete_event_dialog_click);
