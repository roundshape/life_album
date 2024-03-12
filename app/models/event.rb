class Event < ApplicationRecord
  has_many :photos

  validates :name, :start_date, :end_date, presence: { allow_blank: false }
end
