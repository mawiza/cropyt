class Photo < ActiveRecord::Base
	mount_uploader :image, ImageUploader
	belongs_to :user
	
	ASPECT_RATIOS = ['Large', 'Small']
	DEFAULT_IMAGE_WIDTH = 900	
end
