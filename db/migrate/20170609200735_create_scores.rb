class CreateScores < ActiveRecord::Migration[5.1]
  def change
    create_table :scores do |t|
      t.integer  :user_id, null: false
      t.integer  :score, default: 0, null: false

      t.timestamps
    end
    add_foreign_key :scores, :users, on_delete: :cascade
  end
end
