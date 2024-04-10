class PhotosController < ApplicationController
  before_action :set_event
  before_action :set_photo, only: [:destroy]

  # DELETE /events/:event_id/photos/:id
  def destroy
    @photo.destroy
    render json: { status: 'success' }, status: :ok
  end

  private

    # イベントをセットするためのコールバック
    def set_event
      @event = Event.find(params[:event_id])
    end

    # 削除対象の写真をセットするためのコールバック
    def set_photo
      @photo = @event.photos.find(params[:id])
    end
end
