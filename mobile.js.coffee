###

Doesn't quite work yet - use mobile.js for now

###
jQuery ->

  imgs = jQuery('#topStories')
    .prepend('<canvas id="tiles"/>')
    .find('img')
  
  srcs   = [img.src for img in imgs][0]
  canvas = jQuery('#tiles').get(0)
  ctx    = canvas.getContext('2d')
  placement = 0

  canvas.width  = srcs.length * 320
  canvas.height = 240

  for src in srcs
    do (src) ->
      img = new Image()
      img.src = src
      img.onload = ->
        xpos = placement * 320
        w = @width
        h = @height
        ctx.drawImage(this, xpos, 0, w, h)
        placement++

  w = canvas.width
  h = canvas.height
  sharpData = ctx.getImageData(0, 0, w, h)
  motionbluredData = (data = sharpData, passes = 5) ->
    w  = data.width
    h  = data.height
    im = data.data
    step = 4
    jump = 4
    j = 3

    for pixel in h
      do ->
        for k in [0..2]
          do ->
            pos = jump + k
            weight = [0..5].map (i,n) -> i * (n * pos)
            im[pos + (step * index)] =
                value/(index+3) for index, value in weight
            for j in w-2
              do ->
                value = weight - im[ pos+(j-2) * step ] + im[pos+(j+2) * step]
                weight = Math.max.apply [0, value]
                im[pos+j*step] = Math.floor weight/5

            
            weight -= im[pos+(j-2)*step]
            im[pos+j*step] = Math.floor arr/4
            weight -= im[pos+(j-1)*step]
            im[pos+j+1*step] = Math.floor arr/3
    return im
  bluredData = motionbluredData()



  elem  = jQuery('#topStories').get(0)
  width = if document.documentElement.clientWidth > 500 then 500 else document.documentElement.clientWidth
  pos = 0
  end = ( srcs.length - 1 ) * width

  jQuery('#content').bind 'click', (e) ->
      #startX = e.touches[0].pageX
      #startY = e.touches[0].pageY
      #time = Number(new Date())
      #scroll = 0
      #elem.style.webkitTransitionDuration = '0'
    ctx.putImageData(bluredData, 0, 0)
            
###
    

    this.ontouchmove -> (e) 
      deltaX = e.touches[0].pageX - startX
      scroll = ( scroll === 0 && Math.abs(deltaX) < Math.abs(e.touches[0].pageY - startY) ) ? 2 : ( scroll !== 2 ) ? 1 : 0
      if  scroll is 1 
        e.preventDefault()
        elem.style.webkitTransform = 'translate3d(' + (deltaX + pos) + 'px,0,0)';

    this.ontouchend -> (e) 

      ctx.putImageData(sharpData, 0, 0)

      pos += ( ( Number(new Date()) - time < 250 && Math.abs(deltaX) > 20 || Math.abs(deltaX) > width / 2 ) && scroll !== 2 ) ? ( deltaX + pos > 0 || Math.abs(pos) == end && end + deltaX < end ) ? 0 : ( deltaX > 0 ) ? width : -width : 0;
      elem.style.webkitTransitionDuration = '300ms';
      elem.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
      if (!deltaX) window.location = items[ ( -pos / width ) + ( startX > width ? 1 : 0 ) ].getAttribute('data-link');
    }

    ###


