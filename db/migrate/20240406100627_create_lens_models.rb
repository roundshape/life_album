class CreateLensModels < ActiveRecord::Migration[7.0]
  def change
    create_table :lens_models do |t|
      t.text :lens_model_name, null: false
      t.text :display_name,             null: false
      t.text :search_key,             null: false
      t.references :lens_make, null: false, foreign_key: true
      t.timestamps
    end
    # カスタムSQLを使用してmake_nameカラムにユニークインデックスを追加
    # キーレングスとして255文字を指定
    execute <<-SQL
      ALTER TABLE lens_models
      ADD UNIQUE INDEX index_lens_models_on_lens_model_name (lens_model_name(255));
    SQL
  end
end
