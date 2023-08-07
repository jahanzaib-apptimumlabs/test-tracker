class CreateSession < ActiveRecord::Migration[7.0]
  def change
    create_table :sessions do |t|
      t.datetime :checkin_time
      t.datetime :checkout_time
      t.datetime :break_time
      t.datetime :meeting_time
      t.datetime :working_time
      t.interval :break_duration, default: '00:00:00'
      t.interval :meeting_duration, default: '00:00:00'
      t.interval :working_duration, default: '00:00:00'
      t.interval :total_time, default: '00:00:00'

      t.timestamps
    end
  end
end
