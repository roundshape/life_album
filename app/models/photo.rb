class Photo < ApplicationRecord
  belongs_to :event
  has_one_attached :image

  # 検索メソッド
  def self.search(params)
    photos = Photo.all

    if params[:start_date].present? && params[:end_date].present?
      photos = photos.where('date_time >= ? AND date_time <= ?', params[:start_date], params[:end_date])
    elsif params[:start_date].present?
      photos = photos.where('date_time >= ?', params[:start_date])
    elsif params[:end_date].present?
      photos = photos.where('date_time <= ?', params[:end_date])
    end

    if params[:event_name].present?
      # イベント名が含まれる写真を検索
      # ここではイベント名がEventモデルに関連付けられていると仮定
      photos = photos.joins(:event).where('events.name LIKE ?', "%#{params[:event_name]}%")
    end

    photos
  end

end
