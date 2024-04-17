const setupInfoButtonHandlers = function() {
  // myDropzone内のクリックイベントを捕捉するイベントハンドラを設定
  document.getElementById('info_button').addEventListener('click', async function(event) {
    const selectedPhotoIds = Array.from(selectedPhotos);
    if (selectedPhotoIds.length != 1) {
      alert('1つの写真を選択してください');
      return;
    }

    document.getElementById('map').style.display = 'none';
    document.getElementById('photo').style.display = '';

    const eventId = document.querySelector('.image-container').getAttribute('data-event-id');
    const photoId = selectedPhotoIds[0]; // 選択された1つの写真IDを取得

    // 写真の詳細情報を取得して表示する
    await fetchAndDisplayPhotoDetails(eventId, photoId);
  });
};

async function fetchAndDisplayPhotoDetails(eventId, photoId) {
  try {
    const response = await fetch(`/events/${eventId}/list_photos/${photoId}/details`);
    const data = await response.json();

    // 写真の画像URLを更新
    document.getElementById('selected-photo').src = data.image_url;

    // EXIF情報を表示
    const exifList = document.getElementById('photo-exif');
    exifList.innerHTML = ''; // 既存のリストをクリア
    Object.entries(data.exif_json).forEach(([key, value]) => {
      let item = document.createElement('li');
      item.textContent = `${key}: ${value}`;
      exifList.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching photo details:', error);
  }
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", setupInfoButtonHandlers);
