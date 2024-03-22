// Dropzoneの自動発見を無効化
Dropzone.autoDiscover = false;

const upload = function() {
  const dropzoneElement = document.getElementById('myDropzone');
  const dropzoneUrl = dropzoneElement.getAttribute('data-dropzone-url');

  // CSRFトークンをメタタグから取得
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  const dropzone = new Dropzone("div.dropzone", {
      url: dropzoneUrl,
      // Dropzoneの設定にparamsオプションを追加
      params: {
        'authenticity_token': csrfToken, // CSRFトークンを設定
      },
      dictDefaultMessage: "", // デフォルトメッセージを非表示にする
      clickable: false, // ドロップエリアクリックでのダイアログ表示を停止
      init: function() {
        this.on("complete", function(file) {
          // ファイルアップロードが完了した後の処理
          var fileInfoElement = document.createElement("div");
          fileInfoElement.style.textAlign = "center"; // 中央揃えにする
          fileInfoElement.innerHTML = file.name + "<br>" + (file.size / 1024).toFixed(2) + " KB";
          
          // プレビュー要素にファイル情報要素を追加
          file.previewElement.appendChild(fileInfoElement);
        });
      }
    }
  );
};

document.addEventListener("turbo:load", upload);