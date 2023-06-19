class CreateImageRecord < ActiveRecord::Migration[7.0]
  def change
    create_table :image_records, id: :uuid do |t|
      t.references :session, null: true, foreign_key: true, type: :uuid
      t.string :image_url

      t.timestamps
    end
  end
end
