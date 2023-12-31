# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_06_19_113049) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "session_id", null: false
    t.time "start_duration"
    t.time "end_duration"
    t.integer "key_stroke"
    t.integer "mouse_click"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["session_id"], name: "index_activities_on_session_id"
  end

  create_table "image_records", force: :cascade do |t|
    t.bigint "session_id"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["session_id"], name: "index_image_records_on_session_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.datetime "checkin_time"
    t.datetime "checkout_time"
    t.datetime "break_time"
    t.datetime "meeting_time"
    t.datetime "working_time"
    t.interval "break_duration", default: "PT0S"
    t.interval "meeting_duration", default: "PT0S"
    t.interval "working_duration", default: "PT0S"
    t.interval "total_time", default: "PT0S"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "activities", "sessions"
  add_foreign_key "image_records", "sessions"
end
