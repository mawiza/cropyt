class AddDimensionsToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :x1, :float
    add_column :photos, :y1, :float
    add_column :photos, :x2, :float
    add_column :photos, :y2, :float
    add_column :photos, :w, :float
    add_column :photos, :h, :float
    add_column :photos, :overlay_text, :text
  end
end
