class ListPhotosController < ApplicationController
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
      focal_length: photo.focal_length
    }

    render json: { image_url: image_url, exif_json: exif_json }
  end
end
