class CameraModel < ApplicationRecord
  belongs_to :camera_make
  has_many :photos
end
