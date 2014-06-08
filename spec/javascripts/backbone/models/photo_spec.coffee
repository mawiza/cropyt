#= require backbone/cropyt

# I have change events and click events
# Some calls a function like lignment and position
# where as the others gets the element and update the 
# global option to be used somewhere else
# maybe I should create two different one for the 
#       text_alignments = ['left', 'center', 'middle'],
#       text_positions = ['top', 'middle', 'bottom'],
#       overlay_elements = {
#           position:       'onChange', 
#           height:         'onChange', 
#           font:           'onChange', 
#           font_size:      'onChange', 
#           text_alignment: 'click', 
#           text_position:  'click'
#         };

describe 'A Photo model', ->
	it 'should be defined', ->
		expect(Cropyt.Models.Photo).toBeDefined()
	beforeEach ->
		this.photo = new Cropyt.Models.Photo
		  
	describe 'has a list of default attributes that', ->
		it 'should contain a default value for attribute initial_x1', ->
			expect(this.photo.get('initial_x1')).toEqual 0

		it 'should contain a default value for attribute initial_y1', ->
 	  		expect(this.photo.get('initial_y1')).toEqual 0

 	  	it 'should contain a default value for attribute initial_x2', ->
 	  		expect(this.photo.get('initial_x2')).toEqual 0

 	  	it 'should contain a default value for attribute initial_y2', ->
 	  		expect(this.photo.get('initial_y2')).toEqual 0

 	  	it 'should contain a default value for attribute initial_overlay_text', ->
 	  		expect(this.photo.get('initial_overlay_text')).toEqual 'Enter some text'

 	  	it 'should contain a default value for attribute overlay_position', ->
 	  		expect(this.photo.get('overlay_position')).toEqual 0

 	  	it 'should contain a default value for attribute overlay_height', ->
 	  		expect(this.photo.get('overlay_height')).toEqual 35

 	  	it 'should contain a default value for attribute overlay_font', ->
 	  		expect(this.photo.get('overlay_font')).toEqual 'arial,sans-serif'
 	  	  
 	  	it 'should contain a default value for attribute overlay_font_size', ->
 	  		expect(this.photo.get('overlay_font_size')).toEqual 20

 	  	it 'should contain a default value for attribute overlay_text_alignment', ->
 	  		expect(this.photo.get('overlay_text_alignment')).toEqual 'center'

 	  	it 'should contain a default value for attribute overlay_text_position', ->
 	  		expect(this.photo.get('overlay_text_position')).toEqual 'middle'

 	#describe 'has on change events that', ->
 	#	it 'should update the initial_x1 value', ->
 	#		expect(this.photo.set('initial_x1')).toEqual 10 
 		  
