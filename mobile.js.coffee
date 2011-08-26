jQuery ->

  log = (msg) ->
    console?.log msg

  preload = (src) ->
    img        = new Image
    img.onload = -> 
      draw img
      loaded_imgs.push img
      motionblur() if loaded_imgs.length is total_imgs
      
    img.src    = src

  draw = (img) ->
    context.drawImage img, 0, 0, WIDTH, HEIGHT
    imgdata = context.getImageData 0, 0, WIDTH, HEIGHT
    log imgdata.data[1]

  weight = (pixeldata, row) ->
    pixeldata[row] = ( pixeldata[row] + pixeldata[4*row] + pixeldata[8*row] ) / 3
    pixeldata[4*row] = ( pixeldata[row] + pixeldata[12*row] ) / 4
    pixeldata[8*row] = ( pixeldata[row] + pixeldata[16*row] ) / 5

  motionblur = ->
    blur = 0
    pos  = 0
    imagedata = context.getImageData 0, 0, WIDTH, HEIGHT
    pixeldata = imagedata.data

    for row in [0..HEIGHT]
      do ->
        blur = weight pixeldata, row

        for pixel in [3..pixeldata.length-2] by 4
          do ->
            blur = Math.max(0, blur - pixeldata[ row+( pixel-2 )] + pixeldata[row+( pixel+2 )])
            pixeldata[ row + (pixel+1) ] = Math.floor(blur/5)

    context.putImageData imagedata, 0, 0

  WIDTH  = 320
  HEIGHT = 240
  RGBA   = ['RED', 'BLUE']
  loaded_imgs = []
  total_imgs = $('img').length
  
  canvas  = $('#tiles').get 0
  context = canvas.getContext '2d'

  preload img.src for img in $('img')

  return
