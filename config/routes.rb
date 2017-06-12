Rails.application.routes.draw do
  
  devise_for :users, controllers: { registrations: 'users/registrations' }

  root to: 'games#index'

  get '/scores', to: 'scores#index'
  post '/scores', to: 'scores#create'

  get '/movies/find/:name', to: 'movies#find'
  get '/movies/show/:id', to: 'movies#show'

  get '/games', to: 'games#index'
  
  devise_scope :user do
    get 'sign_in', to: 'devise/sessions#new'
  end

end
