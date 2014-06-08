var Crop = function(opt){

  console.log('============================Initiate======================================');

  /***********************************************************************
   **
   **                   Global variable declerations
   **
   ***********************************************************************/

   var defaults = {  
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
      },
      options = $.extend({}, defaults),

      //TODO Refactoring
      /*
        I have change events and click events
        Some calls a function like lignment and position
        where as the others gets the element and update the 
        global option to be used somewhere else
        maybe I should create two different one
      */
      text_alignments = ['left', 'center', 'middle'],
      text_positions = ['top', 'middle', 'bottom'],
      overlay_elements = {
          position:       'onChange', 
          height:         'onChange', 
          font:           'onChange', 
          font_size:      'onChange', 
          text_alignment: 'click', 
          text_position:  'click'
        },

      //JCrop 
      jcrop_api,    
      boundx,
      boundy,

      //Browser window size
      imageContainerWidth = $(document).width() - $('#Tools').width(),
      imageContainerHeight = $(window).height() - $('.container-fluid').height() - $('#footer').height() - 2,

      //Previewpane elements
      $pcnt = $('#preview-pane .preview-container'),
      $pimg = $('#preview-pane .preview-container img'),
      $poverlay = $('#preview-pane .preview-container .text-overlay'),
      $poverlayText = $('#preview-pane .preview-container .text');

  /***********************************************************************
   **
   **                      Function declarations
   **
   ***********************************************************************/

  var setOptions = function(opt) //{{{
  {
    if (typeof(opt) !== 'object') opt = {};
    options = $.extend(options, opt);

    $.each(['onChange','onSelect','onRelease','onDblClick'],function(i,e) {
      if (typeof(options[e]) !== 'function') options[e] = function () {};
    });
  }

  /**
   * Setting the aspect ratio.
   *
   */
  var setAspectRatio = function(a, b)
  {
    var centerX = boundx / 2,
        centerY = boundy / 2,
        x1,
        y1,
        x2,
        y2,
        distance = Math.min(boundx, boundy) / 2,
        ratio = a / b;

    jcrop_api.setOptions({ aspectRatio: 0 });
    if(a != b)
    {
      x1 = centerX - distance * ratio;
      y1 = centerY - distance;
      x2 = centerX + distance * ratio;
      y2 = centerY + distance;
    }
    else
    {
      x1 = centerX - distance;
      y1 = centerY - distance;          
      x2 = centerX + distance;
      y2 = centerY + distance;
    }

    console.log('Preset aspect ratio: ' + a + ':' + b);
    console.log('Center x: ' + centerX);
    console.log('Center y: ' + centerY);
    console.log('Preset crop ratio: ' + ratio);
    console.log('distance: ' + distance);
    console.log('Preset x1: ' + x1);
    console.log('Preset y1: ' + y1);
    console.log('Preset x2: ' + x2);
    console.log('Preset y2: ' + y2);
    jcrop_api.setOptions({ aspectRatio: a/b });
    jcrop_api.setSelect([x1, y1, x2, y2]); 
    $('#lock-ar-btn').addClass('btn-default');
    $('#lock-ar-btn').removeClass('btn-primary');
    jcrop_api.focus();
  };

  /**
   * Center the crop selection position relative to the target image size, 
   * when we do not have any saved data otherwise we use the saved data.
   *
   */
  var centerInitialCropSelection = function(){
    console.log('initial_x1: ' + options.initial_x1); 
    console.log('initial_y1: ' + options.initial_y1);
    console.log('initial_x2: ' + options.initial_x2); 
    console.log('initial_y2: ' + options.initial_y2);

    //center crop position
    if (options.initial_x2 == 0 && options.initial_y2 == 0){
      options.initial_x1 = boundx / 4;
      options.initial_x2 = boundx / 2 + options.initial_x1;
      options.initial_y1 = boundy / 4;
      options.initial_y2 = boundy / 2 + options.initial_y1;          

      console.log('Updatet initial_x1: ' + options.initial_x1);           
      console.log('Updatet initial_x2: ' + options.initial_x2);     
      console.log('Updatet initial_y1: ' + options.initial_y1);          
      console.log('Updatet initial_y2: ' + options.initial_y2);
    }        

    jcrop_api.setSelect([options.initial_x1, options.initial_y1, options.initial_x2, options.initial_y2]);
  };

  /**
   * The image should not fill more than 80% of the editor space.
   *
   */
  var centerTargetImage = function()
  {
    var size = jcrop_api.getWidgetSize();
    var icWidth = $('#Editor').width();
    var width = size[0];        
    var targerContainerWidth = (icWidth - width)/2;
    
    console.log('targerContainerWidth: ' + targerContainerWidth);

    if(targerContainerWidth > 0)
    {
      $('#targer-container').css('margin-left', targerContainerWidth + 'px'); 
    }        
  };

  /**
   * Toggle the buttons - enable one and disabling the rest.
   *
   */
  var toggleButtons = function($enableButton, $disableButton1, $disableButton2)
  {
    $enableButton.addClass('btn-default');
    $enableButton.removeClass('btn-primary');

    if(!$disableButton1.hasClass('btn-primary'))
    {
      $disableButton1.addClass('btn-primary');
    }
    $disableButton1.removeClass('btn-default');

    if(!$disableButton2.hasClass('btn-primary'))
    {
      $disableButton2.addClass('btn-primary');
    }
    $disableButton2.removeClass('btn-default');
  }

   /**
   * Toggle the alignment buttons
   *
   */
  var toggleAlignmentButtons = function(alignment) 
  {
    if(alignment == 'left')
    {
      options.overlay_text_alignment = 'left';
      toggleButtons($('#left_text_alignment_btn'), $('#center_text_alignment_btn'), $('#right_text_alignment_btn'));
    } 
    else if(alignment == 'right')
    {
      options.overlay_text_alignment = 'right';
      toggleButtons($('#right_text_alignment_btn'), $('#left_text_alignment_btn'), $('#center_text_alignment_btn'));
    }
    else
    {
      options.overlay_text_alignment = 'center';
      toggleButtons($('#center_text_alignment_btn'), $('#left_text_alignment_btn'), $('#right_text_alignment_btn'));
    }  

    $("#photo_overlay_text_alignment").val(alignment);
  }

  /**
   * Toggle the position buttons
   *
   */
  var togglePositionButtons = function(position) 
  {
    if(position == 'top')
    {
      options.overlay_text_position = 'top';
      toggleButtons($('#top_text_position_btn'), $('#middle_text_position_btn'), $('#bottom_text_position_btn'));
    } 
    else if(position == 'bottom')
    {
      options.overlay_text_position = 'bottom';
      toggleButtons($('#bottom_text_position_btn'), $('#top_text_position_btn'), $('#middle_text_position_btn'));
    }
    else
    {
      options.overlay_text_position = 'middle';
      toggleButtons($('#middle_text_position_btn'), $('#top_text_position_btn'), $('#bottom_text_position_btn'));
    }  

    $("#photo_overlay_text_position").val(position);
  }

  /**
   * Reset the aspect ratio
   *
   */
  var resetAspectRatio = function()
  {
    var x1 = boundx / 4;
    var x2 = boundx / 2 + x1;        
    var y1 = boundy / 4;
    var y2 = boundy / 2 + y1;

    jcrop_api.setSelect([x1, y1, x2, y2]);
    jcrop_api.setOptions({ aspectRatio: 0 });
    $('#lock-ar-btn').removeClass('btn-default');
    $('#lock-ar-btn').addClass('btn-primary');
    jcrop_api.focus();
  }

  /**
   * Lock aspect ratio
   *
   */
  var lockAspectRatio = function()
  {
    if($('#lock-ar-btn').hasClass('btn-primary'))
    {
      var arW = $('#photo_ratio_width').val(),
          arH = $('#photo_ratio_height').val();
      console.log("Locking the AR");
      jcrop_api.setOptions({ aspectRatio: arW/arH });
      jcrop_api.focus();
      $('#lock-ar-btn').addClass('btn-default');
      $('#lock-ar-btn').removeClass('btn-primary');
    }
    else
    {
      console.log("Unlocking the AR");
      jcrop_api.setOptions({ aspectRatio: 0 });
      $('#lock-ar-btn').removeClass('btn-default');
      $('#lock-ar-btn').addClass('btn-primary');
      jcrop_api.focus();
    }        
  }

  /**
   * Swap aspect ratio
   *
   */
  var swapAspectRatio = function()
  {
    console.log("Swapping the AR");        
    var x1 = $('#photo_x1').val(),
        x2 = $('#photo_x2').val(),
        y1 = $('#photo_y1').val(),
        y2 = $('#photo_y2').val(), 
        arW = $('#photo_ratio_width').val(),
        arH = $('#photo_ratio_height').val();    

    if(!$('#lock-ar-btn').hasClass('btn-default')) 
    {
      setAspectRatio(arH, arW);
      jcrop_api.setOptions({ aspectRatio: 0 });
      $('#lock-ar-btn').removeClass('btn-default');
      $('#lock-ar-btn').addClass('btn-primary');
    }
    else
    {
      setAspectRatio(arH, arW);    
    }
  }

  /**
   * Clear the coordinates.
   *
   */
  var clearCoords = function()
  {
    $('#coords input').val('');
  };

  /**
   * Calculate the greatest common devisor
   *
   */
  var gcd = function(x, y) {
    while (y != 0) {
      var z = x % y;
      x = y;
      y = z;
    }
    return x;
  }
  
  /**
   * Event handler, called from onChange and onSelect
   * event handlers, as per the Jcrop invocation above
   *
   */
  var update = function(c)
  {
    updateUI(c.x, c.y, c.x2, c.y2, c.w, c.h);      
  };

  /**
   * Update the ui
   * TODO
   * This needs to be refactored
   */
  var updateUI = function(x, y, x2, y2, w, h)
  {
    console.log('=========================Updating=================================');
    console.log('==================================================================');

    $('#photo_x1').val(Math.round(x));
    $('#photo_y1').val(Math.round(y));
    $('#photo_x2').val(Math.round(x2));
    $('#photo_y2').val(Math.round(y2));
    $('#photo_width').val(Math.round(w));
    $('#photo_height').val(Math.round(h));      
    
    if (parseInt(w) > 0)
    {
      var maxWidth = $('#Preview').width(),
          maxHeight = $('#Preview').height(),
          ratio = 0,
          width = w,
          height = h;

      //setting the cropsize relative to the preview pane.
      ratio = Math.min(maxWidth / width, maxHeight / height);
      height = height * ratio;
      width = width * ratio;
      $pcnt.css({
        'width': width + 'px',
        'height': height + 'px'
      });
      
      //Setting the image relative to the preview cropsize 
      $pimg.css({
        'width': boundx * ratio + 'px',
        'height': boundy * ratio + 'px',
        'marginLeft': '-' + ratio * x + 'px',
        'marginTop': '-' + ratio * y + 'px'
      });

      //the crop ratio
      var a = parseInt(w, 10);
      var b = parseInt(h, 10);
      var gcdR = gcd(Math.abs(a), Math.abs(b));
      a = w/gcdR;
      b = h/gcdR;
      $('#photo_ratio_width').val(Math.round(a));
      $('#photo_ratio_height').val(Math.round(b));

      console.log("Greatest common devisor: " + gcdR);
      console.log("Relative width of the preview pane: " + width);
      console.log("Relative height of the preview pane: " + height);
      console.log('Preview size ratio: ' + ratio);
      console.log('Position x: ' + x);
      console.log('Position y: ' + y);
      console.log('Position x2: ' + x2);
      console.log('Position y2: ' + y2);
      console.log('Crop width: ' + w);
      console.log('Crop height: ' + h);          
      console.log('boundx: ' + boundx);
      console.log('boundy: ' + boundy);
      console.log('A:B ' + a + ":" + b);
      console.log('==================================================================');

      //TODO 
      //What I did was to minimize the font and overlay size when the crop gets smaller than the overlay,
      //what I can do and maybe should do is to stop the crop size getting smaller than the overlay, when it is active
      var cssHeight = options.overlay_height * ratio;
      if(cssHeight > height)
        cssHeight = height;

      var cssFontSize =  options.overlay_font_size * ratio;
      if(cssFontSize > height)
        cssFontSize = height;

      //updating the preview pane
      $poverlay.css({
        'width': width + 'px',
        'height': cssHeight + 'px',
        'z-index': 1000,
        'position': 'absolute',          
        'opacity': 0.5,
        'background-color': '#000',
        'marginTop': height - cssHeight  - options.overlay_position + 'px',
        'text-align': 'center',          
      });

      //TODO
      //This does not work like I would like it, when the text gets bigger it overlaps the overlay instead of keeping in the overlay bounds
      var bottom = (cssHeight)/2 - 1,
          middle = bottom - (cssFontSize)/2,
          top = bottom - cssFontSize,
          position = middle;

      if(options.overlay_text_position == 'top')
        position = top;
      else if(options.overlay_text_position == 'bottom')
        position = bottom;

      //updating the text
      $poverlayText.css({   
        'width': width +'px',
        'height': cssHeight + 'px',
        'position': 'absolute',          
        'marginTop': height - cssHeight - options.overlay_position + position + 'px',
        'text-align': options.overlay_text_alignment,               
        'color': '#fff',
        'opacity': 1,
        'z-index': 2000,
        'font': cssFontSize + 'px bold ' + options.overlay_font
      });

      $('#photo_overlay_position').val(Math.round(options.overlay_position));
      $('#photo_overlay_text_size').val(options.overlay_font_size);
      $('#photo_overlay_text_font').val(options.overlay_font);
    }
  }

  /***********************************************************************
   **
   **                           Initializers
   **
   ***********************************************************************/

  setOptions(opt);

  //resize the image container so that it fills the whole window - minus the header and footer and the sidebar(tools).
  //Setting the container heights using the window size
  if(imageContainerHeight < 660)
    imageContainerHeight = 660;       
  $('#Editor').css('height', imageContainerHeight);
  $('#Tools').css('height', imageContainerHeight);
  $('#Editor').css('width', imageContainerWidth);

  $( window ).resize(function() {
    $('#Editor').css('height', imageContainerHeight);
    $('#Tools').css('height', imageContainerHeight);
    $('#Editor').css('width', imageContainerWidth);
  });

  /**
   * initialize jcrop
   *
   */
  $('#target').Jcrop({
    onChange:   update,
    onSelect:   update,
    onRelease:  clearCoords,        
    boxHeight:  imageContainerHeight,
    boxWidth:   imageContainerWidth,
    addClass:   'jcrop-dark',
    bgColor:    'black', 
    bgOpacity:  0.4
  },function(){      
    jcrop_api = this;
    jcrop_api.setOptions({ bgFade: true });
    jcrop_api.ui.selection.addClass('jcrop-selection');

    var bounds = this.getBounds();
    boundx = bounds[0];
    boundy = bounds[1];           
    
    centerTargetImage();        
    centerInitialCropSelection();
    toggleAlignmentButtons(options.overlay_text_alignment);
    togglePositionButtons(options.overlay_text_position);

    //Remember to toggle
    $("#overlay-container").hide();
    $("#photo_overlay_height").val(options.overlay_height);
    $poverlayText.text($('#photo_overlay_text').val());        
  });


  /***********************************************************************
   **
   **                           Event Handlers 
   **
   ***********************************************************************/


  /**
   * Update the overlay text on the preview
   *
   */
  $("#photo_overlay_text").on('change keyup paste', function() {
    //TODO
    // Replace linebreaks with <br />.
    $poverlayText.text($('#photo_overlay_text').val());
  });

  //TODO 
  //This can be refactored into a single function call
  $("#photo_overlay_height").change(function(e){
    options.overlay_height = $("#photo_overlay_height").val();
    jcrop_api.enable(); //calling this to update the jcrop interface
  });
  $('#photo_overlay_position').change(function(e){
    options.overlay_position = $("#photo_overlay_position").val();
    jcrop_api.enable(); //calling this to update the jcrop interface
  });
  $('#google_font_selector').change(function(e){
    options.overlay_font = $("#google_font_selector").val();
    jcrop_api.enable(); //calling this to update the jcrop interface
  });
  $('#photo_overlay_text_size').change(function(e){
    options.overlay_font_size = $("#photo_overlay_text_size").val();
    jcrop_api.enable(); //calling this to update the jcrop interface
  });      

  /* Not used
  $('#photo_overlay_text_alignment').change(function(e){
    overlay_text_alignment = $("#photo_overlay_text_alignment").val();
    jcrop_api.enable(); //calling this to update the jcrop interface
  });  

  $('#photo_overlay_text_position').change(function(e){
    overlay_text_position = $("#photo_overlay_text_position").val();
    jcrop_api.enable(); //calling this to update the jcrop interface
  });  

  */
  /**
   * Text alignment event handling
   *
   */
  $('#left_text_alignment_btn').click(function(e) {
    toggleAlignmentButtons('left');
    jcrop_api.enable(); //calling this to update the jcrop interface
  });      
  $('#center_text_alignment_btn').click(function(e) {
    toggleAlignmentButtons('center');
    jcrop_api.enable(); //calling this to update the jcrop interface
  });
  $('#right_text_alignment_btn').click(function(e) {
    toggleAlignmentButtons('right');
    jcrop_api.enable(); //calling this to update the jcrop interface
  });

  /**
   * Text positioning event handling
   *
   */
  $('#top_text_position_btn').click(function(e) {
    togglePositionButtons('top');
    jcrop_api.enable(); //calling this to update the jcrop interface
  });      
  $('#middle_text_position_btn').click(function(e) {
    togglePositionButtons('middle');
    jcrop_api.enable(); //calling this to update the jcrop interface
  });
  $('#bottom_text_position_btn').click(function(e) {
    togglePositionButtons('bottom');
    jcrop_api.enable(); //calling this to update the jcrop interface
  });

  /**
   * Setting the aspect ratio using presets
   *
   */
  $('#aspect-ratio-1-1').click(function(e) {               
    setAspectRatio(1, 1);
  });
  $('#aspect-ratio-3-2').click(function(e) {    
    setAspectRatio(3, 2);        
  });
  $('#aspect-ratio-4-3').click(function(e) {    
    setAspectRatio(4, 3);        
  });
  $('#aspect-ratio-16-9').click(function(e) {    
    setAspectRatio(16, 9);        
  });

  /**
   * Enable or disable the crop functionality, depending on the selected tab.
   *
   */
  $('#crop_overlay_tools_tab a[href="#overlay"]').click(function(e){
    console.log("Disable");
    //jcrop_api.disable();
  });

  $('#crop_overlay_tools_tab a[href="#crop"]').click(function(e){
    console.log("Enable");
    //jcrop_api.enable();
  });

  /**
   * Enable or disable the overlay
   *
   */
   $("#photo_overlay_enabled").change(function(e){
    console.log("photo_overlay_enabled event fired");
    if($("#photo_overlay_enabled").is( ':checked' ))
    {
      $("#overlay-container").show();
      console.log("Show overlay");
    }
    else
    {
      $("#overlay-container").hide();
      console.log("Hide overlay");
    }        
   });
  
  /**
   * Reset lock or swap the aspect ratio to the defaults
   *
   */
  $('#reset-ar-btn').click(function(e) {
    resetAspectRatio();
  });
  $('#lock-ar-btn').click(function(e) {
    lockAspectRatio();
  });
  $('#swap-ar-btn').click(function(e) {
    swapAspectRatio();
  });
};