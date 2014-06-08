class RenameColumnsInPhoto < ActiveRecord::Migration
  def change
  	rename_column :photos, :croppedW, :final_width
  	rename_column :photos, :croppedH, :final_height

  	rename_column :photos, :rW, :ratio_width
    rename_column :photos, :rH, :ratio_height

    rename_column :photos, :arX, :aspect_ratio_x
    rename_column :photos, :arY, :aspect_ratio_y
    rename_column :photos, :aspectRatio, :aspect_ratio

    rename_column :photos, :w, :width
    rename_column :photos, :h, :height
  end
end
