const setupPhotoSelectionHandlers = function() {
  // 選択された写真の詳細を表示するイベントハンドラを統合
  document.querySelectorAll('.image-box').forEach(function(box) {
    box.addEventListener('click', function() {
      // 既に選択されている要素があればハイライトを解除
      const currentHighlight = document.querySelector('.highlight');
      if (currentHighlight) {
        currentHighlight.classList.remove('highlight');
      }
      // クリックされた要素にハイライトクラスを追加
      this.classList.add('highlight');

      // 写真の詳細を取得して表示
      const eventId = document.querySelector('.image-container').getAttribute('data-event-id');
      const photoId = this.getAttribute('data-photo-id');
      fetch(`/events/${eventId}/list_photos/${photoId}/details`) // Railsのルーティングに合わせて調整
        .then(response => response.json())
        .then(data => {
          document.getElementById('selected-photo').src = data.image_url;
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
                                                            
          document.getElementById('photo-details').style.display = 'block';
        });
        
    });
  });

  // ラジオボタン選択時のイベントハンドラ（写真）
  document.getElementById('photo_radio').addEventListener('change', function() {
    if(this.checked) {
      // ここに写真選択時のロジックを追加
    }
  });
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", setupPhotoSelectionHandlers);
