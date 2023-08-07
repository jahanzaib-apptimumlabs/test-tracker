class Session < ApplicationRecord
  has_many :activities
  has_many :image_records
end
