class EventsController < ApplicationController
  def index
    # 開始日と終了日の範囲を設定
    start_date = Date.today.beginning_of_month
    end_date = Date.today.end_of_month

    # 指定された日付範囲に開始または終了するイベントを取得
    @events = Event.where('start_date <= ? AND end_date >= ?', end_date, start_date)
  end

  def date_events
    # URLパラメータから日付を取得
    clicked_date = Date.parse(params[:date])
    start_of_clicked_date = clicked_date.beginning_of_day
    end_of_clicked_date = clicked_date.end_of_day

    # 指定された日付がイベントの開始日と終了日の範囲内にあるイベントを取得
    @events = Event.where('start_date <= ? AND end_date >= ?', end_of_clicked_date, start_of_clicked_date)

    # JSON形式でレスポンスを返す
    render json: @events
  end

  def create
    @event = Event.new(event_params)
    if @event.valid?
      photo_attached = false
      exif_exists = false

      gps_latitude = nil
      gps_longitude = nil
      uploaded_image = nil
      thumbnail_image = nil
      if params[:photo] && params[:photo][:image]
        photo_attached = true
        uploaded_image = photo_params[:image] # UploadedFile オブジェクト
        image_filename = uploaded_image.original_filename
        thumbnail_image = create_thumbnail_and_encode_base64(uploaded_image)

        directory_path = File.dirname(uploaded_image.tempfile)
        tempfile_name = filename = File.basename(uploaded_image.tempfile)
        workfile_path = directory_path + '/w_' + tempfile_name
        FileUtils.cp(uploaded_image.tempfile, workfile_path)
        exif_data = EXIFR::JPEG.new(workfile_path).exif
        FileUtils.rm(workfile_path)
        exif_exists = exif_data ? true : false

        if exif_exists
          if exif_data.gps_latitude
            gps_latitude = get_lat_lng_from_exif(exif_data.gps_latitude, exif_data.gps_latitude_ref)
          end
          if exif_data.gps_longitude
            gps_longitude = get_lat_lng_from_exif(exif_data.gps_longitude, exif_data.gps_longitude_ref)
          end
          
          if exif_data.gps_latitude && exif_data.gps_longitude
            # ここでイベントに緯度経度を設定
            @event.latitude = gps_latitude
            @event.longitude = gps_longitude
          end

          exif_make = nil
          exif_model = nil
          exif_shutter_speed_value = nil
          exif_date_time = nil
          exif_lens_make = nil
          exif_lens_model = nil
          exif_focal_length = nil
          if exif_data.make
             exif_make = exif_data.make
          end
          if exif_data.model
             exif_model = exif_data.model
          end
          if exif_data.shutter_speed_value
             exif_shutter_speed_value = exif_data.shutter_speed_value
          end
          if exif_data.date_time
             exif_date_time = exif_data.date_time
          end
          if exif_data.lens_make
             exif_lens_make = exif_data.lens_make
          end
          if exif_data.lens_model
             exif_lens_model = exif_data.lens_model
          end
          if exif_data.focal_length
             exif_focal_length = exif_data.focal_length
          end
        end

        # トランザクション内でイベントを保存
#        ActiveRecord::Base.transaction do
          @event.save
          if photo_attached
            @event.photos.create(image: uploaded_image, filename: image_filename,
                                  latitude: gps_latitude, longitude: gps_longitude,
                                  make: exif_make, model: exif_model, shutter_speed_value: exif_shutter_speed_value,
                                  date_time: exif_date_time, lens_make: exif_lens_make, lens_model: exif_lens_model,
                                  focal_length: exif_focal_length,
                                  thumbnail: thumbnail_image)
          end
#        end
   
        # 成功した場合の処理
        render json: { status: 'success', redirect_to: root_path }, status: :ok and return
      else #添付画像がない
        @event.save
        render json: { status: 'success', redirect_to: root_path }, status: :ok and return
      end
    else
      render json: { status: 'error', errors: @event.errors.full_messages }, status: :unprocessable_entity
    end    
  end
  
  private

  def event_params
    params.require(:event).permit(:name, :start_date, :end_date)
  end
  
  def photo_params
    params.require(:photo).permit(:image)
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
