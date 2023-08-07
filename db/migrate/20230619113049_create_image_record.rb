class CreateImageRecord < ActiveRecord::Migration[7.0]
  def change
    create_table :image_records do |t|
      t.references :session, null: true, foreign_key: true
      t.string :image_url

      t.timestamps
    end
  end
end
