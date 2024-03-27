class SearchController < ApplicationController
  def index
  end

  def execute_search
    @photos = Photo.search(search_params)
    # Ajaxリクエストに対するレスポンスとしてHTMLを返す
    render partial: "search_results", locals: { photos: @photos }, formats: [:html]
  end

  private

  def search_params
    params.permit(:start_date, :end_date, :event_name, :'camera-make', :'camera-model', :'lens-make', :'lens-model')
  end
  
end
