class Appointment < ApplicationRecord
  belongs_to :physician
  belongs_to :patient

  validates :starts_at, presence: true
  validates :starts_at, uniqueness: {
    scope: :physician_id,
    message: "physician already has an appointment at this time"
  }
end
