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

ActiveRecord::Schema[7.0].define(version: 2024_04_06_100627) do
  create_table "active_storage_attachments", charset: "utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "camera_makes", charset: "utf8", force: :cascade do |t|
    t.text "camera_make_name", null: false
    t.text "display_name", null: false
    t.text "search_key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["camera_make_name"], name: "index_camera_makes_on_camera_make_name", unique: true, length: 255
  end

  create_table "camera_models", charset: "utf8", force: :cascade do |t|
    t.text "camera_model_name", null: false
    t.text "display_name", null: false
    t.text "search_key", null: false
    t.bigint "camera_make_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["camera_make_id"], name: "index_camera_models_on_camera_make_id"
    t.index ["camera_model_name"], name: "index_camera_models_on_camera_model_name", unique: true, length: 255
  end

  create_table "events", charset: "utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "start_date", null: false
    t.datetime "end_date", null: false
    t.decimal "latitude", precision: 15, scale: 10
    t.decimal "longitude", precision: 15, scale: 10
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lens_makes", charset: "utf8", force: :cascade do |t|
    t.text "lens_make_name", null: false
    t.text "display_name", null: false
    t.text "search_key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lens_make_name"], name: "index_lens_makes_on_lens_make_name", unique: true, length: 255
  end

  create_table "lens_models", charset: "utf8", force: :cascade do |t|
    t.text "lens_model_name", null: false
    t.text "display_name", null: false
    t.text "search_key", null: false
    t.bigint "lens_make_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lens_make_id"], name: "index_lens_models_on_lens_make_id"
    t.index ["lens_model_name"], name: "index_lens_models_on_lens_model_name", unique: true, length: 255
  end

  create_table "photos", charset: "utf8", force: :cascade do |t|
    t.string "filename", null: false
    t.decimal "latitude", precision: 15, scale: 10
    t.decimal "longitude", precision: 15, scale: 10
    t.text "camera_model_id"
    t.text "lens_model_id"
    t.text "shutter_speed"
    t.text "focal_length"
    t.text "f_number"
    t.text "iso_speed"
    t.text "date_time"
    t.text "thumbnail", size: :medium
    t.bigint "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_photos_on_event_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "camera_models", "camera_makes"
  add_foreign_key "lens_models", "lens_makes"
  add_foreign_key "photos", "events"
end
