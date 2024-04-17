const edit_event_dialog_click = function() {
  const form = document.getElementById('editEventForm');

  if (form) {
    //ここに、ダイアログの更新ボタンのイベントハンドラーを定義
    form.addEventListener('submit', async function(e) {
      if (e) e.preventDefault();
      const formData = new FormData(this);
      await submitEditEventForm(this.action, formData);
    });
  }
};

async function submitEditEventForm(actionUrl, formData) {
  try {
    const response = await fetch(actionUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin'
    });

    if (!response.ok) {
      // エラーレスポンスを投げて、catchブロックで処理
      throw response;
    }

    const data = await response.json(); // レスポンスボディの解析を待つ

    // レスポンスの内容に応じて処理
    if (data.status === 'success') {
      alert('イベントが正常に更新されました。');

      // カレンダーの更新など、他の更新処理
      const currentMonth = document.querySelector('.calendar-heading > time').getAttribute('datetime');
      await updateCalendar(null, null, currentMonth);
      const updatedDate = document.querySelector('.list-container .title').getAttribute('data-date');
      await updateEventList(updatedDate);
      toggleEditEventModal("none");
    } else if (data.status === 'error') {
      alert(`エラー: ${data.errors.join(', ')}`);
    }
  } catch (error) {
    // レスポンスがエラーJSONデータを含む場合の処理
    if (error instanceof Response) {
      error.json().then(errData => {
        alert(`エラー: ${errData.errors.join(', ')}`);
      }).catch(jsonError => {
        console.error('Error parsing JSON from error response:', jsonError);
      });
    } else {
      // その他のエラー処理
      console.error('Fetch Error:', error);
      alert('エラーが発生しました。詳細はコンソールをご確認ください。');
    }
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
      const photosCount = data.photosCount;

      if (photosCount > 0) {
        // 確認ダイアログの表示
        if (!confirm(`このイベントには${photosCount}件の写真があります。本当にこのイベントを削除してもよろしいですか？`)) {
          return;
        }
      }

      // サーバーに削除リクエストを送信する
      await deleteEvent(eventId);

    } catch (error) {
      console.error('エラーが発生しました:', error);
      alert('写真件数の取得中にエラーが発生しました。');
    }
  });
};

const deleteEvent = async function(eventId) {
  try {
    const response = await fetch(`/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      credentials: 'include'
    });
    const data = await response.json(); // JSONレスポンスの解析

    if (data.status === 'success') {
      // 削除成功の処理
      alert('イベントが正常に削除されました。');
      // カレンダーの更新
      const currentMonth = document.querySelector('.calendar-heading > time').getAttribute('datetime');
      await updateCalendar(null, null, currentMonth);
      const updatedDate = document.querySelector('.list-container .title').getAttribute('data-date');
      await updateEventList(updatedDate); // イベント一覧を再読み込み
      toggleEditEventModal("none");
    } else {
      // 何らかの理由でdata.statusが'success'以外の場合
      throw new Error('予期せぬレスポンスを受け取りました。');
    }
  } catch (error) {
    console.error('削除処理中にエラーが発生しました:', error);
  }
};

document.addEventListener("turbo:load", delete_event_dialog_click);
document.addEventListener("turbo:render", delete_event_dialog_click);
