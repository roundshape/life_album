export function loadEvents(clickedDate) {
  fetch(`/events/date_events?date=${clickedDate}`)
  .then(response => response.json())
  .then(data => {
    // 成功した場合、データを処理
    const listContainer = document.querySelector('.list-container ul');
    listContainer.innerHTML = ''; // 既存のリストアイテムをクリア
    data.forEach(event => {
      // 取得したイベントごとに<li>要素を作成し、リストに追加
      const li = document.createElement('li');
    
      // 「写真」ボタンを作成
      const photoButton = document.createElement('button');
      photoButton.textContent = '写真';
      photoButton.classList.add('photo-button'); // CSSスタイル適用のためのクラスを追加（必要に応じて）

      // 取得したイベントごとにイベントIDを属性として追加
      photoButton.setAttribute('data-event-id', event.id);

      // 「写真」ボタンのクリックイベントリスナーを設定
      photoButton.addEventListener('click', function(event) {
        // デフォルトのイベントを停止（他のイベントリスナーがある場合に他のイベントが発火するのを防ぐため）
        event.stopPropagation();

        // 新規タブで/events/:event_id/list_photosを開く
        const eventId = this.getAttribute('data-event-id');
        window.open(`/events/${eventId}/list_photos`, '_blank');
      });
    
      // <li>要素に「写真」ボタンを追加
      li.appendChild(photoButton);

      // イベント名を表示するためのspan要素を作成
      const eventNameSpan = document.createElement('span');
      eventNameSpan.textContent = event.name; // イベントの名前を設定
      li.appendChild(eventNameSpan); // <li>要素にイベント名を追加
      
      // 緯度経度のデータ属性を追加
      li.setAttribute('data-latitude', event.latitude);
      li.setAttribute('data-longitude', event.longitude);
    
      // <li>要素にクリックイベントリスナーを設定（地図上に場所を表示）
      li.addEventListener('click', function() {
        displayLocationOnMap(event.id);
      });
    
      // <li>要素をリストコンテナに追加
      listContainer.appendChild(li);
    });
    
  })
  .catch(error => console.error('Error:', error));
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