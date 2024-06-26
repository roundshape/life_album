class CreatePhotos < ActiveRecord::Migration[7.0]
  def change
    create_table :photos do |t|
      t.string :filename,             null: false
      t.decimal :latitude, precision: 15, scale: 10
      t.decimal :longitude, precision: 15, scale: 10
      t.references :camera_model, foreign_key: true
      t.references :lens_model, foreign_key: true
      t.text :shutter_speed
      t.text :focal_length
      t.text :f_number
      t.text :iso_speed
      t.text :date_time
      t.text :thumbnail
      t.references :event, null: false, foreign_key: true
      t.timestamps
    end
  end
end
