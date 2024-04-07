class CreateCameraMakes < ActiveRecord::Migration[7.0]
  def change
    create_table :camera_makes do |t|
      t.text :camera_make_name, null: false
      t.text :display_name,             null: false
      t.text :search_key,             null: false
      t.timestamps
    end
    # カスタムSQLを使用してmake_nameカラムにユニークインデックスを追加
    # キーレングスとして255文字を指定
    execute <<-SQL
      ALTER TABLE camera_makes
      ADD UNIQUE INDEX index_camera_makes_on_camera_make_name (camera_make_name(255));
    SQL
  end
end
