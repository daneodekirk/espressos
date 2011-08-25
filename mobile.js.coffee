jQuery ->

  log = (msg) ->
    console?.log msg

  preload = (src) ->
    img        = new Image
    img.onload = -> draw img
    img.src    = src

  draw = (img) ->
    context.drawImage img, 0, 0, WIDTH, HEIGHT
    imgdata = context.getImageData 0, 0, WIDTH, HEIGHT
    log imgdata.data[1]

  WIDTH  = 320
  HEIGHT = 240
  RGBA   = ['RED', 'BLUE']
  
  canvas  = $('#tiles').get 0
  context = canvas.getContext '2d'

  preload img.src for img in $('img')

  return


