class ChangeThumbnailToMediumtextInPhotos < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      ALTER TABLE photos
      MODIFY COLUMN thumbnail MEDIUMTEXT
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE photos
      MODIFY COLUMN thumbnail TEXT
    SQL
  end
end
