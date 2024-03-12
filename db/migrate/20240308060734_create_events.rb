class CreateEvents < ActiveRecord::Migration[7.0]
  def change
    create_table :events do |t|
      t.string :name,               null: false
      t.datetime :start_date,               null: false
      t.datetime :end_date,               null: false
      t.decimal :latitude, precision: 15, scale: 10
      t.decimal :longitude, precision: 15, scale: 10
      t.timestamps
    end
  end
end
