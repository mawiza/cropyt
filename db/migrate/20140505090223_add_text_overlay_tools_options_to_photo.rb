class AddTextOverlayToolsOptionsToPhoto < ActiveRecord::Migration
  def change
    add_column :photos, :overlay_height, :integer
    add_column :photos, :overlay_enabled, :boolean
    add_column :photos, :overlay_text_size, :integer
    add_column :photos, :overlay_text_font, :string
    add_column :photos, :overlay_text_position, :string
    add_column :photos, :overlay_text_alignment, :string
  end
end
