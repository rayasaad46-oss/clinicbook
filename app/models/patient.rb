class Patient < ApplicationRecord
  has_many :appointments, dependent: :destroy
  has_many :physicians, through: :appointments

  validates :name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
end
