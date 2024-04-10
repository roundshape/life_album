namespace :active_storage do
  desc "Remove unused blobs from the database and file storage"
  task cleanup: :environment do
    purged_count = 0
    ActiveStorage::Blob.unattached.each do |blob|
      blob.purge
      purged_count += 1
    end
    if purged_count > 0
      puts "#{purged_count} unused blobs have been purged."
    else
      puts "No unused blobs to purge."
    end
  end
end

