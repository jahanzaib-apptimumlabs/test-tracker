class Activity < ApplicationRecord
  #Associations
  belongs_to :session

  #Scopes
  scope :available, -> { where(end_duration: nil) }
end