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
      filename: photo.filename,
      date_time: photo.date_time,
      camera_make: photo.camera_model.camera_make.camera_make_name,
      camera_model: photo.camera_model.camera_model_name,
      lens_make: photo.lens_model.lens_make.lens_make_name,
      lens_model: photo.lens_model.lens_model_name,
      focal_length: photo.focal_length,
      shutter_speed: photo.shutter_speed,
      f_number: photo.f_number,
      iso_speed: photo.iso_speed,
      longitude: photo.longitude,
      latitude: photo.latitude
    }
    render json: { image_url: image_url, exif_json: exif_json }
  end

  def drop
    @event = Event.find(params[:event_id])
    uploaded_file = photo_params[:file] # ストロングパラメータを通してfileを取得

    exif_exists = false
    gps_latitude = nil
    gps_longitude = nil
    exif_make = nil
    exif_model = nil
    exif_shutter_speed_value = nil
    exif_date_time = nil
    exif_lens_make = nil
    exif_lens_model = nil
    exif_focal_length = nil
    exif_iso_speed_ratings = nil
    exif_f_number = nil
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
      if exif_data.iso_speed_ratings
        exif_iso_speed_ratings = exif_data.iso_speed_ratings
      end
      if exif_data.f_number
        exif_f_number = exif_data.f_number
      end
    end

    if exif_make
      camera_make = find_or_create_record(CameraMake, :camera_make_name, exif_make,
        { camera_make_name: exif_make, display_name: exif_make, search_key: '%' + exif_make.gsub(" ", "%") + '%' }
      )

      # メソッドからnilが返された場合（エラーハンドリングにより）、以降の処理をスキップ
      return unless camera_make
    end

    if exif_model
      camera_model = find_or_create_record(CameraModel, :camera_model_name, exif_model,
        { camera_model_name: exif_model, display_name: exif_model, search_key: '%' + exif_model.gsub(" ", "%") + '%', camera_make_id: camera_make&.id}
      )

      # メソッドからnilが返された場合（エラーハンドリングにより）、以降の処理をスキップ
      return unless camera_model
    end

    if exif_lens_make
      lens_make = find_or_create_record(LensMake, :lens_make_name, exif_lens_make,
        { lens_make_name: exif_lens_make, display_name: exif_lens_make, search_key: '%' + exif_lens_make.gsub(" ", "%") + '%' }
      )

      # メソッドからnilが返された場合（エラーハンドリングにより）、以降の処理をスキップ
      return unless lens_make
    end

    if exif_lens_model
      lens_model = find_or_create_record(LensModel, :lens_model_name, exif_lens_model,
        { lens_model_name: exif_lens_model, display_name: exif_lens_model, search_key: '%' + exif_lens_model.gsub(" ", "%") + '%', lens_make_id: lens_make&.id }
      )

      # メソッドからnilが返された場合（エラーハンドリングにより）、以降の処理をスキップ
      return unless lens_model
    end



    # Photo オブジェクトの作成
    photo = @event.photos.build(image: uploaded_file, filename: image_filename,
                                latitude: gps_latitude, longitude: gps_longitude,
                                camera_model_id: camera_model&.id, lens_model_id: lens_model&.id,
                                shutter_speed: exif_shutter_speed_value, focal_length: exif_focal_length,
                                f_number: exif_f_number, iso_speed: exif_iso_speed_ratings,
                                date_time: exif_date_time, thumbnail: thumbnail_image)
                          
    if photo.save
      # 成功した場合の処理
      render json: { status: 'success' }, status: :ok
    else
      # バリデーションエラーがあった場合
      render json: { status: 'error', errors: photo.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def reload_image_container
    @event = Event.find(params[:event_id])
    html = ''
    @event.photos.each do |photo|
      html += "<div class=\"image-box\" data-photo-id=\"#{photo.id}\">" +
              "<img src=\"#{photo.thumbnail}\"></div>"
    end
    render json: { status: 'success', html: html }, status: :ok
  end

  def display_locations
    # パラメータからイベントIDを取得
    event_id = params[:event_id]

    # イベントIDに紐づく写真の位置情報を取得
    # ここではPhotoモデルがイベントと写真を紐づけていると仮定します
    # 実際のモデル名や関連名に合わせて適宜調整してください
    photos = Photo.where(event_id: event_id).select(:id, :latitude, :longitude)

    # 位置情報をJSON形式でレスポンスとして返す
    render json: photos
  end

  private

  # ストロングパラメータの定義
  def photo_params
    params.permit(:event_id, :file)
  end

  def find_or_create_record(model_class, search_key_name, search_key_value, attributes = {})
    # モデルクラスから検索キーに基づいてレコードを検索
    record = model_class.find_by(search_key_name => search_key_value)

    unless record
      # レコードが存在しない場合、新しく作成
      begin
        record = model_class.create!(attributes)
      rescue ActiveRecord::RecordInvalid => e
        # レコードの作成に失敗した場合のエラーハンドリング
        render json: { status: 'error', errors: e.message }, status: :unprocessable_entity
        return nil
      end
    end
    record
  end

end
