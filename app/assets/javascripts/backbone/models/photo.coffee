
class Cropyt.Models.Photo extends Backbone.Model ->
  paramRoot: 'photo'

  defaults: {   		
        initial_x1: 0,
        initial_y1: 0,
        initial_x2: 0,
        initial_y2: 0,
        initial_overlay_text: 'Enter some text',
        overlay_position: 0,
        overlay_height: 35,
        overlay_font: 'arial,sans-serif',
        overlay_font_size: 20,
        overlay_text_alignment: 'center',
        overlay_text_position: 'middle'
      }

  

class Cropyt.Collections.PhotosCollection extends Backbone.Collection ->
  model: Cropyt.Models.Photo
  url: '/photos'
 