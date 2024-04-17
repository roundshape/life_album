// モーダル表示と非表示の関数
const toggleEditEventModal = (displayStyle) => {
  const selectedEvent = document.querySelector('.selected-event');
  if (displayStyle === "block" && !selectedEvent) {
    alert('イベントを選択してください');
    return;
  }

  const modal = document.getElementById("edit_event_modal");
  modal.style.display = displayStyle;

  // モーダルを表示する場合、選択されたイベントの情報をフォームに設定
  if (displayStyle === "block") {
    if (selectedEvent) {
      const eventId = selectedEvent.getAttribute('data-event-id');
      const eventName = selectedEvent.getAttribute('data-event-name');
      const eventStartDate = selectedEvent.getAttribute('data-event-start-date');
      const eventEndDate = selectedEvent.getAttribute('data-event-end-date');

      const deleteButton = document.getElementById('deleteEvent');
      if (deleteButton) {
        deleteButton.setAttribute('data-event-id', eventId);
      }

      const form = document.getElementById('editEventForm');
      form.action = `/events/${eventId}`;

      document.getElementById('editEventName').value = eventName;
      document.getElementById('editEventStartDate').value = eventStartDate.slice(0, -6); // タイムゾーン情報を削除
      document.getElementById('editEventEndDate').value = eventEndDate.slice(0, -6); // タイムゾーン情報を削除
      

      // _method hiddenフィールドを適切に設定
      const methodInput = document.createElement('input');
      methodInput.type = 'hidden';
      methodInput.name = '_method';
      methodInput.value = 'put';
      const oldMethodInput = form.querySelector('input[name="_method"]');
      if (oldMethodInput) {
        form.removeChild(oldMethodInput);
      }
      form.appendChild(methodInput);
    }
  }
};

const setupEditEventEventHandlers = () => {
  document.getElementById("openEditModal").addEventListener('click', () => toggleEditEventModal("block"));
  document.getElementsByClassName("edit-event-close-button")[0].addEventListener('click', () => toggleEditEventModal("none"));
  document.getElementById("closeEditEventModal").addEventListener('click', () => toggleEditEventModal("none"));
};

// Turbo Drive関連のイベントに対応する
document.addEventListener("turbo:load", setupEditEventEventHandlers);