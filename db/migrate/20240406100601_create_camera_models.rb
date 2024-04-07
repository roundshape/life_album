class CreateCameraModels < ActiveRecord::Migration[7.0]
  def change
    create_table :camera_models do |t|
      t.text :camera_model_name, null: false
      t.text :display_name,             null: false
      t.text :search_key,             null: false
      t.references :camera_make, null: false, foreign_key: true
      t.timestamps
    end
    # カスタムSQLを使用してmake_nameカラムにユニークインデックスを追加
    # キーレングスとして255文字を指定
    execute <<-SQL
      ALTER TABLE camera_models
      ADD UNIQUE INDEX index_camera_models_on_camera_model_name (camera_model_name(255));
    SQL
  end
end
