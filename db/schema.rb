# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140509092035) do

  create_table "photos", force: true do |t|
    t.string   "image"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "x1"
    t.float    "y1"
    t.float    "x2"
    t.float    "y2"
    t.float    "width"
    t.float    "height"
    t.text     "overlay_text"
    t.integer  "aspect_ratio_x"
    t.integer  "aspect_ratio_y"
    t.string   "aspect_ratio"
    t.integer  "ratio_width"
    t.integer  "ratio_height"
    t.integer  "user_id"
    t.integer  "overlay_height"
    t.boolean  "overlay_enabled"
    t.integer  "overlay_text_size"
    t.string   "overlay_text_font"
    t.string   "overlay_text_position"
    t.string   "overlay_text_alignment"
    t.integer  "overlay_position"
    t.integer  "final_width"
    t.integer  "final_height"
  end

  add_index "photos", ["user_id"], name: "index_photos_on_user_id"

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
