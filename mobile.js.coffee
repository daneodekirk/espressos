jQuery ->

  log = (msg) ->
    console?.log msg

  preload = (src) ->
    img        = new Image
    img.onload = -> 
      draw img
      loaded_imgs.push img
      if loaded_imgs.length is total_imgs
        imgdata = context.getImageData 0, 0, WIDTH, HEIGHT
        blured = motionblur imgdata
        context.putImageData blured, 0, 0
        return
      
    img.src    = src

  draw = (img) ->
    context.drawImage img, 0, 0, WIDTH, HEIGHT

  motionblur = (img, passes) ->
    w = img.width
    h = img.height
    im = img.data
    rounds = passes or 1
    pos = step = jump = inner = outer = arr = 0
    n = 0
    while n < rounds
      m = 0
      while m < 2
        if m
          outer = w
          inner = h
          step = w * 4
        else
          outer = h
          inner = w
          step = 4
        i = 0
        while i < outer
          jump = (if m == 0 then i * w * 4 else 4 * i)
          k = 0
          while k < 3
            pos = jump + k
            j = arr = 0
            while j < 5
              arr += im[pos + step * j]
              j++
            img[pos] = im[pos + step] = im[pos + step * 2] = Math.floor(arr / 5)
            j = 3
            while j < inner - 2
              arr = Math.max(0, arr - im[pos + (j - 2) * step] + im[pos + (j + 2) * step])
              im[pos + j * step] = Math.floor(arr / 5)
              j++
            im[pos + j * step] = im[pos + (j + 1) * step] = Math.floor(arr / 5)
            k++
          i++
        m++
      n++
    img
  

    

  WIDTH  = 320
  HEIGHT = 240
  RGBA   = ['RED', 'BLUE']
  loaded_imgs = []
  total_imgs = $('img').length
  
  canvas  = $('#tiles').get 0
  context = canvas.getContext '2d'

  preload img.src for img in $('img')

  return
