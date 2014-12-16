var Color = net.brehaut.Color;

// The colors are stored to calculate the ratios between the main color and the shadows for Hue, Saturation and Value.
// This is used to keep the color of the shadows consistent as main color changes

var primary = Color('#F26B24');
var secondary = Color('#DC5B26');
var tertiary = Color('#B05126');
var quaternary = Color('#AD4825');

var background = Color('#032c2c');

var defaultShadowOpacity = 0.3;

var currentColor = 'f26b24';
var currentBackground = '032c2c';
var currentOpacity = defaultShadowOpacity;

// Restore the defaults if they are present in the hash
var chunks = window.location.hash.split('-');
if( chunks.length === 3 ) {
  currentColor = chunks[0];
  currentBackground = chunks[1];
  currentOpacity = chunks[2];
}

function updateLogo(newColor, shadowOpacity) {
  var color = Color('#'+newColor);
  var darkenMultiplier = 1.0;
  var desaturateMultiplier = 1.0;

  var shadowMultiplier = shadowOpacity / defaultShadowOpacity;

  $('path.primary')   .attr('fill',  color.toCSSHex() );
  $('path.secondary') .attr('fill',  color.shiftHue( secondary.toHSV().hue - primary.toHSV().hue )
                                          .desaturateByRatio( (primary.toHSV().saturation - secondary.toHSV().saturation) / primary.toHSV().saturation )
                                          .devalueByRatio( (primary.toHSV().value - secondary.toHSV().value) / primary.toHSV().value * shadowMultiplier )
                                          .toCSSHex() );
  $('path.tertiary') .attr('fill',   color.shiftHue( tertiary.toHSV().hue - primary.toHSV().hue )
                                          .desaturateByRatio( (primary.toHSV().saturation - tertiary.toHSV().saturation) / primary.toHSV().saturation )
                                          .devalueByRatio( (primary.toHSV().value - tertiary.toHSV().value) / primary.toHSV().value * shadowMultiplier )
                                          .toCSSHex() );
  $('path.quaternary') .attr('fill', color.shiftHue( quaternary.toHSV().hue - primary.toHSV().hue )
                                          .desaturateByRatio( (primary.toHSV().saturation - quaternary.toHSV().saturation) / primary.toHSV().saturation )
                                          .devalueByRatio( (primary.toHSV().value - quaternary.toHSV().value) / primary.toHSV().value * shadowMultiplier )
                                          .toCSSHex() );
}


$(document).ready(function(){


  var hashChangeTimeout = null;

  $('#main_color').colpick({
    layout:'hex',
    submit:0,
    colorScheme:'dark',
    onChange:function(hsb,hex,rgb,el,bySetColor) {
      // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
      if(!bySetColor) $(el).val(hex);

      currentColor = hex;
      updateLogo(currentColor, currentOpacity);

      clearTimeout(hashChangeTimeout);
      hashChangeTimeout = setTimeout(function(){
        window.location.hash = currentColor +'-'+ currentBackground +'-'+ Math.round(currentOpacity*100)/100;
      }, 300);
    }
  }).keyup(function(){
    $(this).colpickSetColor(this.value);
  }).colpickSetColor( currentColor );


  $('#background_color').colpick({
    layout:'hex',
    submit:0,
    colorScheme:'dark',
    onChange:function(hsb,hex,rgb,el,bySetColor) {
      // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
      if(!bySetColor) $(el).val(hex);

      currentBackground = hex;
      $('main').css('background-color', '#'+currentBackground);

      clearTimeout(hashChangeTimeout);
      hashChangeTimeout = setTimeout(function(){
        window.location.hash = currentColor +'-'+ currentBackground +'-'+ Math.round(currentOpacity*100)/100;
      }, 300);
    }
  }).keyup(function(){
    $(this).colpickSetColor(this.value);
  }).colpickSetColor( currentBackground );


  $("#shadow_opacity").bind("slider:changed", function (event, data) {
    currentOpacity = data.ratio;
    updateLogo(currentColor, currentOpacity);

    clearTimeout(hashChangeTimeout);
    hashChangeTimeout = setTimeout(function(){
      window.location.hash = currentColor +'-'+ currentBackground +'-'+ Math.round(currentOpacity*100)/100;
    }, 300);
  }).simpleSlider().simpleSlider('setRatio', currentOpacity);



  $('#randomize').on('click', function(event){
    event.preventDefault();
    var newColor = Color('#ffffff')
      .setHue( Math.random() * 360 )
      .setValue( 0.8 + Math.random() * 0.2 )
      .setSaturation( 0.7 + Math.random() * 0.3 );

    $('#main_color').colpickSetColor( newColor.toCSSHex() );
    $('#background_color').colpickSetColor( newColor.shiftHue( (Math.random() > 0.5 ? +1 : -1) * 60).toCSSHex() );

    $("#shadow_opacity").simpleSlider('setRatio', defaultShadowOpacity);
  });


  $('#reset').on('click', function(event){
    event.preventDefault();

    $('#main_color').colpickSetColor( primary.toCSSHex() );
    $('#background_color').colpickSetColor( background.toCSSHex() );

    $("#shadow_opacity").simpleSlider('setRatio', defaultShadowOpacity);
  });


  $('main').removeClass('loading');

});