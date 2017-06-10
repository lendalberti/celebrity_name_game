class MoviesController < ApplicationController
  include ApplicationHelper

  before_action :authenticate_user!

  def find
    pDebug("Movies::find - #{params.inspect}")
    data = []
    @movies = []

    # data['poster']['img_src']
    # data['actors'][0]['img_src']
    # data['actors'][0]['actor_name']
    
    # movie.results.each do |m| puts "#{m.id} - #{m.title}, #{m.release_date}" end

    data = Tmdb::Search.movie( params['name'] )
    movie_count = data.results.size

    if movie_count > 0          
      data.results.each do |movie|
        @movies.push ({ id: movie.id, title: movie.title, release_date: movie.release_date, poster: movie.poster_path })
      end
      render json: { count: movie_count, movies: @movies }
    else
      render json: { count: movie_count, status: 'Movie not found.' }
    end 

  end
 
  def show
    data = Tmdb::Movie.detail( params['id'] )
    cast = Tmdb::Movie.cast( params['id'] )
    cast_list = []
    pDebug("Movies::show - data: #{data.inspect}")

    cast.each do |c|
      cast_list.push ({ id: c.id, profile_path: c.profile_path, name: c.name  })
    end

    render json: { id: data.id, title: data.title, release_date: data.release_date, poster: data.poster_path, overview: data.overview, cast: cast_list }
  end

  def index
  end

  def new
  end
  
  def edit
  end
  
  def create
  end
  
  def update
  end
  
  def destroy
  end

end