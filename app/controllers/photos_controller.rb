require 'RMagick'

class PhotosController < ApplicationController
  before_action :set_photo, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!

  # GET /photos
  # GET /photos.json
  def index
    @photos = current_user.photos    
  end

  # GET /photos/1
  # GET /photos/1.json
  def show
  end

  # GET /photos/new
  def new
    @photos = current_user.photos  
    @photo = Photo.new
    if current_user.photos.count >= 5   
      flash.now[:error] = "Only a maximim of 5 photos allowed, please delete some and try again!"      
    end    
  end

  # GET /photos/1/edit
  def edit    
  end

  # POST /photos
  # POST /photos.json
  def create
    @photos = current_user.photos
    @photo = Photo.new(photo_params)    
    @photo.user = current_user    
    @photo.save
  end

  # PATCH/PUT /photos/1
  # PATCH/PUT /photos/1.json
  def update    
      if @photo.update(photo_params)       
        image = Magick::Image.read(@photo.image.current_path).first
        filename = File.basename(image.filename).downcase
        
        puts @photo.to_yaml

        boundX = Photo::DEFAULT_IMAGE_WIDTH
        boundY = image.rows.to_f * boundX.to_f / image.columns.to_f
        puts "boundX: #{boundX}"
        puts "boundY: #{boundY}"

        puts "-----------------------"

        xRatio = image.columns.to_f / boundX.to_f
        yRatio = image.rows.to_f / boundY.to_f
        puts "xRatio: #{xRatio}"
        puts "yRatio: #{yRatio}"

        puts "-----------------------"

        x1Relative = xRatio.to_f * @photo.x1.to_f
        y1Relative = yRatio.to_f * @photo.y1.to_f        
        puts "x1Relative: #{x1Relative}"
        puts "y1Relative: #{y1Relative}"

        puts "-----------------------"

        wRelative = xRatio.to_f * @photo.w.to_f
        hRelative = yRatio.to_f * @photo.h.to_f
        puts "wRelative: #{wRelative}"
        puts "hRelative: #{hRelative}"

        puts "-----------------------"

        image.crop!(x1Relative, y1Relative, wRelative, hRelative)                
        puts "Cropped Width: #{image.columns}"
        puts "Cropped Height: #{image.rows}"
        
        puts "-----------------------"
        
        image.resize_to_fit!(@photo.arX)
        puts "Scaled Width: #{image.columns}"
        puts "Scaled Height: #{image.rows}"

        if not @photo.overlay_text.blank?
          #ADD THE OVERLAY
          overlay = Magick::Image.new(@photo.arX, 35) {
            self.background_color = "rgba(0,0,0,0.5)"
          }

          overlayText = Magick::Draw.new
          overlayText.annotate(overlay, 0,0,0,0, @photo.overlay_text) {
              self.font_family = 'Arial'
              self.fill = 'white'            
              self.pointsize = 20
              #self.font_weight = Magick::BoldWeight
              self.gravity = Magick::CenterGravity
              self.text_align(Magick::CenterAlign)
          }

          # Combine them!
          image.composite!(overlay, Magick::SouthGravity, Magick::OverCompositeOp)
        end

        send_data image.to_blob, filename: filename, type: "image/" + image.format.downcase
        
        puts "-----------------------"
      else
        respond_to do |format|
          format.html { render action: 'edit' }
          format.json { render json: @photo.errors, status: :unprocessable_entity }
        end
      end
  end


  def delete    
    @photo = Photo.find(params[:photo_id])    
  end

  # DELETE /photos/1
  # DELETE /photos/1.json
  def destroy
    @photo.destroy
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_photo
      @photo = Photo.find(params[:id])
      @photos = current_user.photos
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def photo_params
      params.require(:photo).permit(:user_id, :image, :x1, :y1, :x2, :y2, :h, :w, :overlay_text, :arX, :arY, :aspectRatio, :rW, :rH)
    end
end
