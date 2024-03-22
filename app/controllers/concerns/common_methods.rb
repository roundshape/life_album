# app/controllers/concerns/common_methods.rb
module CommonMethods
  extend ActiveSupport::Concern

  included do
    # ここにコールバック等を定義
  end

  # アップロードされた画像ファイル（例: params[:photo][:image]）を処理
  def create_thumbnail_and_encode_base64(uploaded_image)
    # サムネイルをリサイズ（例: 256x256）
    processed_image = ImageProcessing::MiniMagick
                          .source(uploaded_image.tempfile)
                          .resize_to_limit(256, 256)
                          .call

    # サムネイルをBase64エンコード
    base64_encoded_image = Base64.encode64(File.read(processed_image.path))

    # "data:image/jpeg;base64,"をプレフィックスとしてBase64エンコーディングされた画像データを返す
    "data:image/jpeg;base64,#{base64_encoded_image}"
  end

  def get_lat_lng_from_exif(exif_tag, exif_ref)
    degrees = exif_tag[0]
    minutes = exif_tag[1]
    seconds = exif_tag[2]
    value = degrees + (minutes / 60) + (seconds / 3600)
    if exif_ref == 'S' || exif_ref == 'W'
      value *= -1
    end
    return value.to_f
  end
end
