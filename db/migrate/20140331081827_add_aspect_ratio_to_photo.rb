class AddAspectRatioToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :arX, :integer
    add_column :photos, :arY, :integer
    add_column :photos, :aspectRatio, :string
  end
end
