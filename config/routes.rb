Rails.application.routes.draw do
  root "events#index"
  
  resources :events, only: [:index, :create, :new, :edit, :show, :update, :destroy] do
    get 'nav_month', on: :collection
    get :date_events, on: :collection
    resources :list_photos, only: [:index] do
      get :details, on: :member
      post :drop, on: :collection
      get :reload_image_container, on: :collection
      get :display_locations, on: :collection
    end
  end

  # search コントローラーの index アクションは検索画面を表示します。
  resources :search, only: [:index] do
    # 検索を実行するカスタムアクション。collection を使っています。
    collection do
      post :execute_search
    end
  end
end
