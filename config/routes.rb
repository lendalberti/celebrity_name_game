Rails.application.routes.draw do
  
  devise_for :users, controllers: { registrations: 'users/registrations' }
  resources :scores

  root to: 'games#index'

  get '/movies/find/:name', to: 'movies#find'
  get '/movies/show/:id', to: 'movies#show'

  devise_scope :user do
    get 'sign_in', to: 'devise/sessions#new'
  end

end
