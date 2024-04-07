class LensModel < ApplicationRecord
  belongs_to :lens_make
  has_many :photos
end
