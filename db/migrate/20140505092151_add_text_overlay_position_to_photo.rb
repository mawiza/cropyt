class AddTextOverlayPositionToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :overlay_position, :integer
  end
end
