Rails.application.routes.draw do
  resources :physicians do
    resources :appointments, only: [:index, :create, :destroy]
  end
end
