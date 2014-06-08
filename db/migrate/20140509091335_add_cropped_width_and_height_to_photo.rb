class AddCroppedWidthAndHeightToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :croppedW, :integer
    add_column :photos, :croppedH, :integer
  end
end
