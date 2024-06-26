let markers = []; // マーカーを追跡するための配列

const setupMapButtonHandlers = function() {
  document.getElementById('map_button').addEventListener('click', async function(event) {
    // 既存のマーカーをクリア
    markers.forEach(marker => marker.setMap(null));
    markers = []; // マーカー配列をリセット

    const selectedPhotoIds = Array.from(selectedPhotos);
    if (selectedPhotoIds.length === 0) {
      alert('写真が選択されていません');
      return;
    }

    document.getElementById('map').style.display = '';
    document.getElementById('photo').style.display = 'none';
  
    const eventId = document.querySelector('.image-container').getAttribute('data-event-id');
    const bounds = new google.maps.LatLngBounds(); // 地図の表示範囲を調整するためのboundsオブジェクト

    for (let photoId of selectedPhotoIds) {
      try {
        const response = await fetch(`/events/${eventId}/list_photos/${photoId}/details`);
        const data = await response.json();
        
        if (data.exif_json && data.exif_json.latitude && data.exif_json.longitude) {
          const photoLocation = {
            lat: parseFloat(data.exif_json.latitude),
            lng: parseFloat(data.exif_json.longitude)
          };
          
          // 写真の位置にマーカーを追加し、配列に保存
          const marker = new google.maps.Marker({
            position: photoLocation,
            map: window.map,
          });
          markers.push(marker);
          bounds.extend(marker.getPosition()); // マーカーの位置をboundsに追加
        }
      } catch (error) {
        console.error('Error fetching photo details:', error);
      }
    }

    if (!bounds.isEmpty()) {
      window.map.fitBounds(bounds); // boundsに基づいて地図の表示範囲を調整
    }
  });
};

document.addEventListener("turbo:load", setupMapButtonHandlers);
