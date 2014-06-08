class AddRelativeWidthAndHeightToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :rW, :integer
    add_column :photos, :rH, :integer
  end
end
