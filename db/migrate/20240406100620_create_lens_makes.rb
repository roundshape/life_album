class CreateLensMakes < ActiveRecord::Migration[7.0]
  def change
    create_table :lens_makes do |t|
      t.text :lens_make_name, null: false
      t.text :display_name,             null: false
      t.text :search_key,             null: false
      t.timestamps
    end
    # カスタムSQLを使用してmake_nameカラムにユニークインデックスを追加
    # キーレングスとして255文字を指定
    execute <<-SQL
      ALTER TABLE lens_makes
      ADD UNIQUE INDEX index_lens_makes_on_lens_make_name (lens_make_name(255));
    SQL
  end
end
