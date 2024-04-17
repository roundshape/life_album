const setMapButtonHandler = () => {
  const mapButton = document.getElementById("mapButton");
  // 「マップ」ボタンのクリックイベントリスナーを設定
  mapButton.addEventListener('click', async function(event) { // ここにも async を追加
    const selectedEvent = document.querySelector('.selected-event');
    if (!selectedEvent) {
      alert('イベントを選択してください');
      return;
    }

    // デフォルトのイベントを停止
    event.stopPropagation();

    const eventId = selectedEvent.getAttribute('data-event-id');
    try {
      await displayLocationOnMap(eventId); // await を使用して非同期処理の完了を待つ
    } catch (error) {
      console.error('Error:', error);
      // 適切なエラーハンドリングをここに記述
    }
  });
};

async function displayLocationOnMap(eventId) {
  try {
    const response = await fetch(`/events/${eventId}/list_photos/display_locations`);
    const data = await response.json(); // response.json() にも await を使用

    const bounds = new google.maps.LatLngBounds();
    data.forEach(photo => {
      if (photo.latitude != null && photo.longitude != null) {
        const latLng = new google.maps.LatLng(photo.latitude, photo.longitude);
        bounds.extend(latLng);

        // 各写真の位置にマーカーを設置
        new google.maps.Marker({
          position: latLng,
          map: map,
        });
      }
    });

    // マップをバウンダリーにフィットさせる
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    } else {
      alert('位置情報が登録されている写真がありません。');
    }
  } catch (error) {
    console.error('Error:', error);
    // エラーが発生した場合の処理をここに記述
    throw error; // エラーを再スローして、呼び出し元で捕捉可能にする
  }
};

document.addEventListener("turbo:load", setMapButtonHandler);