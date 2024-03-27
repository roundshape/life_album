class Photo < ApplicationRecord
  belongs_to :event
  has_one_attached :image

  # 検索メソッド
  def self.search(params)
    photos = Photo.includes(:event)
    photos = photos.where("events.name LIKE ?", "%#{params[:event_name]}%") if params[:event_name].present?
    photos = photos.where("date_time LIKE ?", "%#{params[:date_time]}%") if params[:date_time].present?
    photos = photos.where("make LIKE ?", "%#{params[:make]}%") if params[:make].present?
    photos
  end

end
