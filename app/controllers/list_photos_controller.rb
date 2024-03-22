class ListPhotosController < ApplicationController
  include CommonMethods

  def index
    @event = Event.find(params[:event_id])
    @photos = @event.photos
  end

  def details
    photo = Photo.find(params[:id])

    # image_url = rails_representation_url(photo.image.variant(resize_to_limit: [512, 512]), only_path: true)
    image_url = rails_blob_url(photo.image, only_path: true)

    exif_json = {
      make: photo.make, # これらの属性はモデルに合わせて調整
      model: photo.model,
      shutter_speed_value: photo.shutter_speed_value,
      date_time: photo.date_time,
      lens_make: photo.lens_make,
      lens_model: photo.lens_model,
      focal_length: photo.focal_length,
      longitude: photo.longitude,
      latitude: photo.latitude
    }
    render json: { image_url: image_url, exif_json: exif_json }
  end

  def drop
    @event = Event.find(params[:event_id])
    uploaded_file = photo_params[:file] # ストロングパラメータを通してfileを取得
    # ここでファイルの処理を行う
    exif_exists = false
    gps_latitude = nil
    gps_longitude = nil
    thumbnail_image = nil
    image_filename = uploaded_file.original_filename
    thumbnail_image = create_thumbnail_and_encode_base64(uploaded_file)
    directory_path = File.dirname(uploaded_file.tempfile)
    tempfile_name = File.basename(uploaded_file.tempfile)
    workfile_path = directory_path + '/w_' + tempfile_name
    FileUtils.cp(uploaded_file.tempfile, workfile_path)
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
    # Photo オブジェクトの作成
    photo = @event.photos.build(image: uploaded_file, filename: image_filename,
                                latitude: gps_latitude, longitude: gps_longitude,
                                make: exif_make, model: exif_model, shutter_speed_value: exif_shutter_speed_value,
                                date_time: exif_date_time, lens_make: exif_lens_make, lens_model: exif_lens_model,
                                focal_length: exif_focal_length,
                                thumbnail: thumbnail_image)
    if photo.save
      # 成功した場合の処理
      render json: { status: 'success' }, status: :ok
    else
      # バリデーションエラーがあった場合
      render json: { status: 'error', errors: photo.errors.full_messages }, status: :unprocessable_entity
    end

  end

  private

  # ストロングパラメータの定義
  def photo_params
    params.permit(:event_id, :file)
  end
end
