const setPhotoButtonHandler = () => {
  
  const photoButton = document.getElementById("photoButton");
  // 「写真」ボタンのクリックイベントリスナーを設定
  photoButton.addEventListener('click', function(event) {
    const selectedEvent = document.querySelector('.selected-event');
    if (!selectedEvent) {
      alert('イベントを選択してください');
      return;
    }

    // デフォルトのイベントを停止（他のイベントリスナーがある場合に他のイベントが発火するのを防ぐため）
    event.stopPropagation();

    // 新規タブで/events/:event_id/list_photosを開く
    const eventId = selectedEvent.getAttribute('data-event-id');
    // ウィンドウ名にイベントIDを使用してユニークにする
    const windowName = `PhotosForEvent_${eventId}`;
    // 同じイベントIDの写真リストを表示するために同じウィンドウ名を使用する
    window.open(`/events/${eventId}/list_photos`, windowName)
  });
};

document.addEventListener("turbo:load", setPhotoButtonHandler);