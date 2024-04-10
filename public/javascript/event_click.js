document.addEventListener('DOMContentLoaded', function() {
  // イベントリスト内のすべてのイベントにイベントリスナーを設定
  const ulElement = document.querySelector('.list-container ul');
  if (!ulElement) {
    return;
  }
  document.querySelector('.list-container ul').addEventListener('click', function(e) {
    // クリックされた要素がLI要素内のものであるか確認し、もしそうならそのLI要素を取得
    const targetLi = e.target.closest('li');
    if (targetLi) {
      // 以前に選択されたイベントからクラスを削除
      const previousSelected = document.querySelector('.selected-event');
      if (previousSelected) {
        previousSelected.classList.remove('selected-event');
      }

      // クリックされたイベントにクラスを適用
      targetLi.classList.add('selected-event');
    }
  });
});