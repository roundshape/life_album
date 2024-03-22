const setupPhotoSelectionHandlers = function() {
  // myDropzone内のクリックイベントを捕捉するイベントハンドラを設定
  document.getElementById('myDropzone').addEventListener('click', async function(event) {
  // クリックされた要素が.image-box内のものか、または.image-box自身かを確認
  const box = event.target.closest('.image-box');
  if (!box) return; // .image-boxがクリックされていなければ何もしない
  
  // 既に選択されている要素があればハイライトを解除
  const currentHighlight = document.querySelector('.highlight');
  if (currentHighlight) {
    currentHighlight.classList.remove('highlight');
  }
  // クリックされた要素にハイライトクラスを追加
  box.classList.add('highlight');

  // 写真の詳細を取得して表示
  let locationFound = false;
  const eventId = document.querySelector('.image-container').getAttribute('data-event-id');
  const photoId = box.getAttribute('data-photo-id');

  try {
    const response = await fetch(`/events/${eventId}/list_photos/${photoId}/details`);
    const data = await response.json(); // JSONの解析
      document.getElementById('selected-photo').src = data.image_url;

      // 写真の地図上の位置を表示
      if (data.exif_json) {
        const exif = data.exif_json;
        document.getElementById('photo-exif').innerHTML = `
                                                          メーカー: ${exif.make}<br>
                                                          モデル: ${exif.model}<br>
                                                          シャッタースピード: ${exif.shutter_speed_value}<br>
                                                          撮影日時: ${exif.date_time}<br>
                                                          レンズメーカー: ${exif.lens_make}<br>
                                                          レンズモデル: ${exif.lens_model}<br>
                                                          焦点距離: ${exif.focal_length}
                                                          `;
      } else {
        document.getElementById('photo-exif').innerHTML = '';
      }
      document.getElementById('photo-details').style.display = 'block';

      // 写真の地図上の位置を表示
      if (data.exif_json.latitude && data.exif_json.longitude) {
        locationFound = true;
        const photoLocation = {
          lat: parseFloat(data.exif_json.latitude),
          lng: parseFloat(data.exif_json.longitude)
        };
        // 既存のマーカーを削除（オプション）
        if (window.photoMarker) {
          window.photoMarker.setMap(null);
        }
        // 写真の位置にマーカーを追加
        window.photoMarker = new google.maps.Marker({
          position: photoLocation,
          map: window.map,
        });
        // 地図の中心を写真の位置に移動
        window.map.setCenter(photoLocation);
      }
    } catch (error) {
      console.error('Error fetching photo details:', error);
    }

    if (!locationFound) {
      alert('位置情報がありません');
    }  
  });

  // // ラジオボタン選択時のイベントハンドラ（写真）
  // document.getElementById('photo_radio').addEventListener('change', function() {
  //   if(this.checked) {
  //     // ここに写真選択時のロジックを追加
  //   }
  // });

  // // ラジオボタン選択時のイベントハンドラ（地図）
  // document.getElementById('map_radio').addEventListener('change', function() {
  //   if(this.checked) {
  //     // ここに地図選択時のロジックを追加
  //   }
  // });
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", setupPhotoSelectionHandlers);

function updateDisplay() {
  // チェックされているラジオボタンを取得
  var selectedValue = document.querySelector('input[name="selection"]:checked').value;

  // 条件に応じて表示を切り替え
  if (selectedValue === 'map') {
    document.getElementById('map').style.display = '';
    document.getElementById('photo').style.display = 'none';
  } else if (selectedValue === 'photo') {
    document.getElementById('map').style.display = 'none';
    document.getElementById('photo').style.display = '';
  }
}

const switchMapOrPhoto = function() {
  // 初期表示設定
  updateDisplay();

  // ラジオボタンの状態が変わった時の処理を設定
  document.querySelectorAll('input[name="selection"]').forEach(function(radio) {
    radio.addEventListener('change', updateDisplay);
  });
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", switchMapOrPhoto);


const reloadImageContainer = function() {
  const reloadImageContainerElement = document.getElementById('reload-ImageContainer');
  const reloadImageContainerUrl = reloadImageContainerElement.getAttribute('data-reload-url');
  reloadImageContainerElement.addEventListener('click', function() {
    fetch(reloadImageContainerUrl)
    .then(response => response.json()) // JSONとして解析
    .then(data => {
      if (data.status === 'success') {
        // myDropzoneの内容をサーバーからの応答で更新
        document.getElementById('myDropzone').innerHTML = data.html;
        resetDisplay();
      } else {
        console.error('Error reloading images');
      }
    })
    .catch(error => console.error('Error loading new images:', error));
  });
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", reloadImageContainer);

const resetDisplay = function() {
  // 写真詳細表示領域のリセット
  document.getElementById('selected-photo').src = ''; // 写真のsrcをクリア
  document.getElementById('photo-exif').innerHTML = ''; // EXIF情報をクリア

  // ラジオボタンの状態に基づいて表示を切り替え
  const photoRadioButton = document.getElementById('photo_radio');
  const mapRadioButton = document.getElementById('map_radio');
  
  if (photoRadioButton.checked) {
    document.getElementById('photo').style.display = 'block'; // 写真詳細を表示
    document.getElementById('map').style.display = 'none'; // 地図を非表示
  } else if (mapRadioButton.checked) {
    document.getElementById('map').style.display = 'block'; // 地図を表示
    document.getElementById('photo').style.display = 'none'; // 写真詳細を非表示
  } else {
    // デフォルトの動作（例えば、両方非表示にするなど）
    document.getElementById('photo').style.display = 'none';
    document.getElementById('map').style.display = 'none';
  }

  // 地図の中心を初期位置にリセット（東京タワー）
  if (window.map) {
    window.map.setCenter({ lat: 35.6586, lng: 139.7454 });
    window.map.setZoom(13);
  }
};
