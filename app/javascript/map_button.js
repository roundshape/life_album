const setMapButtonHandler = () => {
  
  const mapButton = document.getElementById("mapButton");
  // 「マップ」ボタンのクリックイベントリスナーを設定
  mapButton.addEventListener('click', function(event) {
    const selectedEvent = document.querySelector('.selected-event');
    if (!selectedEvent) {
      alert('イベントを選択してください');
      return;
    }

    // デフォルトのイベントを停止（他のイベントリスナーがある場合に他のイベントが発火するのを防ぐため）
    event.stopPropagation();

    const eventId = selectedEvent.getAttribute('data-event-id');
    displayLocationOnMap(eventId);
  });
};

function displayLocationOnMap(eventId) {
  fetch(`/events/${eventId}/list_photos/display_locations`)
    .then(response => response.json())
    .then(data => {
      const bounds = new google.maps.LatLngBounds();
      data.forEach(photo => {
        if (photo.latitude != null && photo.longitude != null) {
          const latLng = new google.maps.LatLng(photo.latitude, photo.longitude);
          bounds.extend(latLng);

          // 任意で、各写真の位置にマーカーを設置することもできます
          new google.maps.Marker({
            position: latLng,
            map: map,
          });
        }
      });

      // マップをバウンダリーにフィットさせる
      if (!bounds.isEmpty()) {
        // マップをバウンダリーにフィットさせる
        map.fitBounds(bounds);
      } else {
        // 位置情報が定義されている写真がない場合の処理（例: アラートを表示）
        alert('位置情報が登録されている写真がありません。');
      }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener("turbo:load", setMapButtonHandler);