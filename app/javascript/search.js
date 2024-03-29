const search_form = function() {
  document.getElementById("search-form").addEventListener("submit", function(e) {
    e.preventDefault(); // フォームのデフォルト送信を防止

    const url = this.action; // フォームのaction属性からURLを取得
    const formData = new FormData(this); // フォームのデータをFormDataオブジェクトとして取得

    // CSRFトークンを<meta>タグから取得
    const csrfToken = document.querySelector("[name='csrf-token']").getAttribute("content");

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest', // Ajaxリクエストであることを示す
        'X-CSRF-Token': csrfToken // CSRFトークンをヘッダーに追加
      },
    })
    .then(response => response.text()) // レスポンスをテキストとして解析
    .then(html => {
      document.getElementById("search-results").innerHTML = html; // 解析したHTMLをDOMに挿入
    })
    .catch(error => console.error('Error:', error));
  });
};

document.addEventListener("turbo:load", search_form);

const selected_row = function() {
  // #search-results要素に対してクリックイベントリスナーを設定
  document.getElementById("search-results").addEventListener("click", function(e) {
    // クリックされた要素を取得
    let targetElement = e.target;

    // クリックされた要素が<td>でない場合、<td>を探す
    while (targetElement !== null && targetElement.nodeName !== "TD") {
      targetElement = targetElement.parentNode;
    }

    // <td>が見つかり、その親要素が<tr>であることを確認
    if (targetElement && targetElement.parentNode.nodeName === "TR") {
      // まず、すべての行から'selected-row'クラスを削除
      document.querySelectorAll("#search-results tr").forEach(function(otherRow) {
        otherRow.classList.remove("selected-row");
      });

      // <tr>要素のクラスリストをトグル
      targetElement.parentNode.classList.toggle("selected-row");
    }
  });
};

document.addEventListener("turbo:load", selected_row);

const reset_selected_row = function() {
  // リセットボタンのクリックイベントリスナーを設定
  document.getElementById("reset-operation").addEventListener("click", function() {
    // #search-results内のすべての<tr>要素を取得
    const rows = document.querySelectorAll("#search-results tr");

    // 各行から'selected-row'クラスを削除
    rows.forEach(function(row) {
      row.classList.remove("selected-row");
    });
  });
};

document.addEventListener("turbo:load", reset_selected_row);

const photo_operation = function() {
  // 詳細ボタンのクリックイベントリスナーを設定
  document.getElementById('photo-operation').addEventListener('click', function() {
    // 選択されたすべての行を取得
    const selectedRows = document.querySelectorAll('tr.selected-row');
  
    // 選択された行がない場合は警告を表示して処理を中断
    if (selectedRows.length === 0) {
      alert('イベントが選択されていません。');
      return;
    }
  
    selectedRows.forEach(function(row) {
      const eventId = row.getAttribute('data-event-id');
      //const confirmMessage = `イベントID ${eventId} の詳細を表示しますか？`;
  
      //if (confirm(confirmMessage)) {
        const windowName = `PhotosForEvent_${eventId}`;
        const url = `/events/${eventId}/list_photos`;
        window.open(url, windowName);
      //}
    });
  });
};

document.addEventListener("turbo:load", photo_operation);

const reset_conditions_button = function() {
  // リセットボタンのクリックイベントリスナーを設定
  document.getElementById("reset_conditions_button").addEventListener("click", function() {
    // 各フィールドの値を初期状態に戻す
    document.getElementById("start_date").value = '';
    document.getElementById("end_date").value = '';
    document.getElementById("event_name").value = '';
  });
};

document.addEventListener("turbo:load", reset_conditions_button);
