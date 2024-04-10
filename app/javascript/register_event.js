// モーダル表示と非表示の関数
const toggleNewEventModal = (displayStyle) => {
  document.getElementById("new_event_modal").style.display = displayStyle;
};

const setupNewEventEventHandlers = () => {
  document.getElementById("openRegisterModal").addEventListener('click', () => toggleNewEventModal("block"));
  document.getElementsByClassName("new-event-close-button")[0].addEventListener('click', () => toggleNewEventModal("none"));
  document.getElementById("closeNewEventModal").addEventListener('click', () => toggleNewEventModal("none"));
};

// Turbo Drive関連のイベントに対応する
document.addEventListener("turbo:load", setupNewEventEventHandlers);