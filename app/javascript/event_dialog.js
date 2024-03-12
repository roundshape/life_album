const event_dialog_click = function() {
  const modal = document.getElementById('modal');
  // const openModalBtn = document.getElementById('openModal');
  // const closeModalBtn = document.getElementsByClassName('close-button')[0];
  const form = document.getElementById('eventForm');

  // モーダルを開く
  // openModalBtn.addEventListener('click', function() {
  //   modal.style.display = 'block';
  // });

  // モーダルを閉じる
  // closeModalBtn.addEventListener('click', function() {
  //   modal.style.display = 'none';
  // });

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content,
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(data => {
        if (data.status === 'success') {
          // モーダルを非表示
          modal.style.display = 'none';
          // 任意: ページに成功メッセージを表示
          alert('イベントが正常に登録されました。');
        } else if (data.status === 'error') {
          // エラーメッセージを表示
          alert(`エラー: ${data.errors.join(', ')}`);
        }
      })
      .catch(error => {
        error.json().then(errData => {
          alert(`エラー: ${errData.errors.join(', ')}`);
        });
      });
    });
  }
};

document.addEventListener("turbo:load", event_dialog_click);
document.addEventListener("turbo:render", event_dialog_click);
