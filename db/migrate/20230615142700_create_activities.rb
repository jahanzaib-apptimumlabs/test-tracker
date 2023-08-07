class CreateActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :activities, id: :uuid do |t|
      t.references :session, null: false, foreign_key: true
      t.time :start_duration
      t.time :end_duration
      t.integer :key_stroke
      t.integer :mouse_click

      t.timestamps
    end
  end
end
