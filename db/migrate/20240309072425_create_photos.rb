class CreatePhotos < ActiveRecord::Migration[7.0]
  def change
    create_table :photos do |t|
      t.string :filename,             null: false
      t.decimal :latitude, precision: 15, scale: 10
      t.decimal :longitude, precision: 15, scale: 10
      t.text :make
      t.text :model
      t.text :shutter_speed_value
      t.text :date_time
      t.text :lens_make
      t.text :lens_model
      t.text :focal_length
      t.text :thumbnail
      t.references :event, null: false, foreign_key: true
      t.timestamps
    end
  end
end
