class ImageRecord < ApplicationRecord
	#Associations
	belongs_to :session, optional: true

	#Validations
	validates :image_url, presence: true, format: { with: URI::DEFAULT_PARSER.make_regexp }
end