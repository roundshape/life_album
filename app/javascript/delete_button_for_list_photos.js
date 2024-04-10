const setupDeleteButtonHandlers = function() {
  document.getElementById('delete_button').addEventListener('click', async function(event) {
    const selectedPhotoIds = Array.from(selectedPhotos);
    if (selectedPhotoIds.length === 0) {
      alert('削除する写真が選択されていません');
      return;
    }

    if (!confirm(`${selectedPhotoIds.length}件の写真が選択されています。本当に削除してもよろしいですか？`)) {
      return;
    }

    const eventId = document.querySelector('.image-container').getAttribute('data-event-id');

    for (let photoId of selectedPhotoIds) {
      await deletePhoto(eventId, photoId); // 写真を削除する非同期関数を呼び出し
    }

    // 既存のマーカーを全てマップから削除
    markers.forEach(marker => marker.setMap(null));
    // マーカー配列をリセット
    markers = [];

    // 削除後の写真再描処理
    const reloadImageContainerElement = document.getElementById('reload-ImageContainer');
    const reloadImageContainerUrl = reloadImageContainerElement.getAttribute('data-reload-url');
    reloadImages(reloadImageContainerUrl); 
  });
};

document.addEventListener("turbo:load", setupDeleteButtonHandlers);

async function deletePhoto(eventId, photoId) {
  try {
    const response = await fetch(`/events/${eventId}/photos/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector("[name='csrf-token']").content
      },
    });

    if (response.ok) {
      // console.log(`Photo ${photoId} deleted successfully.`);
      selectedPhotos.delete(photoId); // selectedPhotosから削除
      // 必要に応じてマーカーの削除などの追加処理をここに記述
    } else {
      console.error(`Failed to delete photo ${photoId}.`);
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
}
