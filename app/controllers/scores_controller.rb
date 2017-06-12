class ScoresController < ApplicationController
  before_action :authenticate_user!

  
  def index
    @scores = Score.all
  end
  
  def create
    record = Score.new
    record.user_id = current_user.id
    record.movie   = get_movie_name(params['movie'])
    record.score   = params['score']
    if record.save
      render json: { status: 'ok' }
    else
      render json: { status: 'error' }
    end
  end


  

  private

  def get_movie_name(id)
    data = Tmdb::Movie.detail(id)
    data.title
  end



end
