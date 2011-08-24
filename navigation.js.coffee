jQuery.fn.extend
  dubslide: (options) ->
    settings =
      name  : '#dubslide-subnav'
      width : window.clientWidth
      debug : false
    
    settings = jQuery.extend settings, options

    #logging if debug is true
    log = (msg) ->
      console?.log msg if settings.debug

    #append the div if it doesn't exist
    this.append("<div id='#{settings.name}'/>") if not $(settings.name).length
    
    return @each () ->
      wrapper = $( this )
      wrapper.delegate 'li', 'click', ( event ) ->
        $(settings.name).html $(this).children('ul').clone()
        wrapper.animate
          'left': '100%',
          700
          
jQuery ->
  jQuery('#siteNav').dubslide()

