// Dropzoneの自動発見を無効化
Dropzone.autoDiscover = false;

// dropzone変数をより広いスコープで定義
let dropzone;

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
        this.on("addedfile", function(file) {
          // 最初のファイルが追加されたときに右端へスクロール
          if (this.files.length === 1) {
            scrollToRight(dropzoneElement);
          }
        });
  
        this.on("queuecomplete", function() {
          // 全てのファイルのアップロードが完了したときに右端へスクロール
          scrollToRight(dropzoneElement);
        });

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

  // 停止ボタンのクリックイベントを設定
  document.getElementById('cancelUpload').addEventListener('click', function() {
    cancelUploads(dropzone);
  });
};

// 未アップロードのファイルをキャンセルする関数
function cancelUploads(dropzone) {
  dropzone.getQueuedFiles().forEach(file => {
    dropzone.removeFile(file);
  });
};

// 要素を右端にスクロールする関数
function scrollToRight(element) {
  element.scrollLeft = element.scrollWidth;
}

document.addEventListener("turbo:load", upload);