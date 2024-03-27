const nav_search = function() {
  document.querySelector('.nav_search').addEventListener('click', function() {
    // 検索ページのURL
    const searchUrl = '/search';
    // 固有のウィンドウ名を使用して検索ページを開く
    // この名前を持つタブが既に存在する場合、そのタブが再利用される
    window.open(searchUrl, 'life-album-search');
  });
};

document.addEventListener("turbo:load", nav_search);