jQuery.fn.extend
  dubslide: (options) ->
    settings =
      width : window.clientWidth
      debug : false
    
    settings = jQuery.extend settings, options

    log = (msg) ->
      console?.log msg if settings.debug

    wrapper = this
    subnav = this.append('<div id="dubslide-subnav"/>')
                 .find '#dubslide-subnav'
    
    return @each () ->
      $(this).delegate 'li', 'click', ( event ) ->
        subnav.html $(this).children('ul').clone()
        wrapper.animate
          'left': '100%',
          700
          
jQuery ->
  jQuery('#siteNav').dubslide()

