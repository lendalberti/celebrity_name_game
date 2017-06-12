class AddMovieToScores < ActiveRecord::Migration[5.1]
  def change
    add_column :scores, :movie,  :string, limit: 255, after: :score
  end
end
