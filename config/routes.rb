Rails.application.routes.draw do
  root "events#index"
  
  resources :events, only: [:index, :create, :new, :edit, :show, :update, :destroy] do
    get :date_events, on: :collection
    resources :list_photos, only: [:index] do
      get :details, on: :member
    end
  end
  
end
