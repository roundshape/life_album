const new_event_dialog_click = function() {
  const modal = document.getElementById('new_event_modal');
  const form = document.getElementById('newEventForm');

  if (form) {
    form.addEventListener('submit', async function(e) {
      if (e) e.preventDefault();

      const formData = new FormData(this);
      try {
        const data = await submitNewEvent(this.action, formData);

        if (data.status === 'success') {
          modal.style.display = 'none';
          alert('イベントが正常に登録されました。');

          const currentMonth = document.querySelector('.calendar-heading > time').getAttribute('datetime');
          await updateCalendar(null, null, currentMonth);
          const updatedDate = document.querySelector('.list-container .title').getAttribute('data-date');
          if (updatedDate) {
            await updateEventList(updatedDate);
          }
          toggleNewEventModal("none");
        } else if (data.status === 'error') {
          alert(`エラー: ${data.errors.join(', ')}`);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
        if (error instanceof Response) {
          error.json().then(errData => {
            alert(`エラー: ${errData.errors.join(', ')}`);
          }).catch(jsonError => {
            console.error('Error parsing JSON from error response:', jsonError);
          });
        } else {
          alert('エラーが発生しました。詳細はコンソールをご確認ください。');
        }
      }
    });
  }
};

async function submitNewEvent(action, formData) {
  const response = await fetch(action, {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'same-origin'
  });

  if (!response.ok) {
    // HTTPレスポンスがokでない場合は、レスポンスを投げてcatchブロックで捕捉
    throw response;
  }

  return await response.json();
}

document.addEventListener("turbo:load", new_event_dialog_click);
document.addEventListener("turbo:render", new_event_dialog_click);
