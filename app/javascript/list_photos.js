const selectedPhotos = new Set(); // 選択された写真のIDを保持するSetオブジェクト

const setupPhotoSelectionHandlers = function() {
  // クリックされた要素が.image-box内のものか、または.image-box自身かを確認
  document.getElementById('myDropzone').addEventListener('click', function(event) {
    const box = event.target.closest('.image-box');
    if (!box) return;

    const photoId = box.getAttribute('data-photo-id');

    // 選択状態を切り替え
    if (selectedPhotos.has(photoId)) {
      selectedPhotos.delete(photoId);
      box.classList.remove('highlight');
    } else {
      selectedPhotos.add(photoId);
      box.classList.add('highlight');
    }
  });
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", setupPhotoSelectionHandlers);

const reloadImageContainer = function() {
  const reloadImageContainerElement = document.getElementById('reload-ImageContainer');
  const reloadImageContainerUrl = reloadImageContainerElement.getAttribute('data-reload-url');
  reloadImageContainerElement.addEventListener('click', function() {
    // URLを使用して画像をリロードする関数を呼び出す
    reloadImages(reloadImageContainerUrl);
  });
};

// Turbo Driveを使用している場合のページロードイベント
document.addEventListener("turbo:load", reloadImageContainer);

async function reloadImages(url) {
  try {
    const response = await fetch(url); // fetchをawaitで呼び出し
    const data = await response.json(); // レスポンスの解析もawaitで待つ

    if (data.status === 'success') {
      // myDropzoneの内容をサーバーからの応答で更新
      document.getElementById('myDropzone').innerHTML = data.html;
    } else {
      console.error('Error reloading images');
    }
  } catch (error) {
    console.error('Error loading new images:', error);
  }
}
