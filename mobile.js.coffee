jQuery ->

  log = (msg) ->
    console?.log msg

  preload = (src) ->
    img        = new Image
    img.onload = -> 
      draw img
      loaded_imgs.push img
      #motionblur() if loaded_imgs.length is total_imgs
      if loaded_imgs.length is total_imgs
        imgdata = context.getImageData 0, 0, WIDTH, HEIGHT
        blured = bluur imgdata
        context.putImageData blured, 0, 0
        return
      
    img.src    = src

  draw = (img) ->
    context.drawImage img, 0, 0, WIDTH, HEIGHT
    #imgdata = context.getImageData 0, 0, WIDTH, HEIGHT
    #log imgdata.data[1]

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

  bluur = (img, passes) ->
    # Same as blur, but fakes borders for nicer code
    # Increase passes for blurrier image
    #var i, j, k, m, n, w = img.width, h = img.height, im = img.data,
    #	rounds = passes || 0,
    #	pos = step = jump = inner = outer = arr = 0;

    pos = 0
    rounds = passes or 1
    h  = img.height
    w  = img.width
    im = img.data

    for n in [0..rounds-1]
        # Row blurring
        outer = h
        inner = w
        step = 4
        
        for i in [0..outer-1]
            jump = 4*i
            for k in [0..2]
                pos = jump+k
                arr = 0

                for j in [0..4]
                    arr += im[pos+step*j]

                img[pos] = im[pos+step] = im[pos+step*2] = Math.floor(arr/5) # Slightly wrong, but nicer to read
                for j in [3..inner-3]
                    arr = Math.max(0, arr - im[pos+(j-2)*step] + im[pos+(j+2)*step])
                    im[pos+j*step] = Math.floor(arr/5)
                # j is now inner - 2 (1 bigger)
                im[pos+j*step] = im[pos+(j+1)*step] = Math.floor(arr/5) # Slightly wrong, but nicer to read
    return img


    

  WIDTH  = 320
  HEIGHT = 240
  RGBA   = ['RED', 'BLUE']
  loaded_imgs = []
  total_imgs = $('img').length
  
  canvas  = $('#tiles').get 0
  context = canvas.getContext '2d'

  preload img.src for img in $('img')

  return
