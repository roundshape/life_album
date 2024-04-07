class Photo < ApplicationRecord
  belongs_to :event
  belongs_to :camera_model
  belongs_to :lens_model
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

    # カメラメーカーによるフィルタリング
    if params[:camera_make].present? && params[:camera_make].to_i > 0
      photos = photos.where(camera_make_id: params[:camera_make])
    end

    # カメラモデルによるフィルタリング
    if params[:camera_model].present? && params[:camera_model].to_i > 0
      photos = photos.where(camera_model_id: params[:camera_model])
    end

    # レンズメーカーによるフィルタリング
    if params[:lens_make].present? && params[:lens_make].to_i > 0
      photos = photos.where(lens_make_id: params[:lens_make])
    end

    # レンズモデルによるフィルタリング
    if params[:lens_model].present? && params[:lens_model].to_i > 0
      photos = photos.where(lens_model_id: params[:lens_model])
    end

    photos
  end

end
