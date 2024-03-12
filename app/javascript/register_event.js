// モーダル表示と非表示の関数
const toggleModal = (displayStyle) => {
  document.getElementById("modal").style.display = displayStyle;
};

const setupEventHandlers = () => {
  document.getElementById("openModal").addEventListener('click', () => toggleModal("block"));
  document.getElementsByClassName("close-button")[0].addEventListener('click', () => toggleModal("none"));
  document.getElementById("closeModal").addEventListener('click', () => toggleModal("none"));

  // document.getElementById('openListPhotos').addEventListener('click', function() {
  //   var url = this.getAttribute('data-url'); // data-url 属性からURLを取得
  //   window.open(url, '_blank');
  // });
};

// Turbo Drive関連のイベントに対応する
document.addEventListener("turbo:load", setupEventHandlers);