class Event < ApplicationRecord
  has_many :photos

  validates :name, :start_date, :end_date, presence: { allow_blank: false }
  # カスタムバリデーションメソッドの呼び出し
  validate :end_date_after_start_date

  private

  # end_dateがstart_dateより後であることを確認するカスタムバリデーションメソッド
  def end_date_after_start_date
    return if end_date.blank? || start_date.blank?

    if end_date < start_date
      errors.add(:end_date, "must be after the start date")
    end
  end
end
