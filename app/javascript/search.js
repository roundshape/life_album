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