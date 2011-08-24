/*
 * By Dane Odekirk - UW Marketing
 *
 * inspired by m.adrien.edu
 */
$(document).ready(function() {
    

  /*** this is hacked to work for cmsdev and hsould be removed once we get going on the project ****/

    var srcs = [];
    $('#topStories').prepend('<canvas id="tiles"/>')
                  .find('img').each(function() {
                    srcs.push( $(this).attr('src'));
                  });

/**** END ****/

    var canvas = document.getElementById("tiles"),
            ctx = canvas.getContext("2d"),
            //srcs = [ 'images/uw.jpeg', "images/image.jpeg", "images/image-1.jpeg", "images/image-2.jpeg" ]
            imgs = [], 
            sharpData = null,
            bluredData = null,
            placement = 0;

    

    var len = srcs.length;

    canvas.width = srcs.length * 320;
    canvas.height = 240;

    while (len--) {

        var img = new Image();
                 
        img.src = srcs[ len ] ;

        imgs.push( img )   

    }

    var len = imgs.length;

    while (len--) {
        imgs[ len ].onload = function () {
                var xpos = placement * 320;

                var w = this.width, h = this.height;
         
                ctx.drawImage(this, xpos, 0, w, h);
         
                placement++;
                if( placement == imgs.length ) {

                    getImageDatas();

                }
        };
    }


function getImageDatas () {

    var w = canvas.width, h = canvas.height;

    sharpData = ctx.getImageData(0, 0, w, h);

    //bluredData = ctx.getImageData(0, 0, w, h);

    motionbluredData = ctx.getImageData(0, 0, w, h);

    //bluredData = blur(bluredData, 1);

    motionbluredData = motionblur(motionbluredData, 5);
    //ctx.putImageData(sharpData, 0, 0);

}


function motionblur (sharpImage, passes) {

    var img = sharpImage;
	// Blur as described in article http://web.archive.org/web/20060718054020/http://www.acm.uiuc.edu/siggraph/workshops/wjarosz_convolution_2001.pdf
	// Increase passes for blurrier image
	var i, j, k, n, w = img.width, h = img.height, im = img.data,
		rounds = passes || 0,
		pos = step = jump = inner = outer = arr = 0;
 
	for(n=0;n<rounds;n++) {
		for(var m=0;m<2;m++) { // First blur rows, then columns
			//if (m) {
			//	// Values for column blurring
			//	outer = w; inner = h;
			//	step = w*4;
			//} else {
				// Row blurring
				outer = h; inner = w;
				step = 4;
			//}
			for (i=0; i < outer; i++) {
				jump = m === 0 ? i*w*4 : 4*i;
				for (k=0;k<3;k++) { // Calculate for every color: red, green and blue
					pos = jump+k;
					arr = 0;
					// First pixel in line
					arr = im[pos]+im[pos+step]+im[pos+step*2];
					im[pos] = Math.floor(arr/3);
					// Second
					arr += im[pos+step*3];
					im[pos+step] = Math.floor(arr/4);
					// Third and last. Kernel complete and other pixels in line can work from there.
					arr += im[pos+step*4];
					im[pos+step*2] = Math.floor(arr/5);
					for (j = 3; j < inner-2; j++) {
						arr = Math.max(0, arr - im[pos+(j-2)*step] + im[pos+(j+2)*step]);
						im[pos+j*step] = Math.floor(arr/5);
					}
					// j is now inner - 2 (1 bigger)
					// End of line needs special handling like start of it
					arr -= im[pos+(j-2)*step];
					im[pos+j*step] = Math.floor(arr/4);
					arr -= im[pos+(j-1)*step];
					im[pos+(j+1)*step] = Math.floor(arr/3);
				}
			}
		}
	}
	return img;
}


function blur (sharpImage, passes) {
    var img = sharpImage;
	// Blur as described in article http://web.archive.org/web/20060718054020/http://www.acm.uiuc.edu/siggraph/workshops/wjarosz_convolution_2001.pdf
	// Increase passes for blurrier image
	var i, j, k, n, w = img.width, h = img.height, im = img.data,
		rounds = passes || 0,
		pos = step = jump = inner = outer = arr = 0;
 
	for(n=0;n<rounds;n++) {
		for(var m=0;m<2;m++) { // First blur rows, then columns
			if (m) {
				// Values for column blurring
				outer = w; inner = h;
				step = w*4;
			} else {
				// Row blurring
				outer = h; inner = w;
				step = 4;
			}
			for (i=0; i < outer; i++) {
				jump = m === 0 ? i*w*4 : 4*i;
				for (k=0;k<3;k++) { // Calculate for every color: red, green and blue
					pos = jump+k;
					arr = 0;
					// First pixel in line
					arr = im[pos]+im[pos+step]+im[pos+step*2];
					im[pos] = Math.floor(arr/3);
					// Second
					arr += im[pos+step*3];
					im[pos+step] = Math.floor(arr/4);
					// Third and last. Kernel complete and other pixels in line can work from there.
					arr += im[pos+step*4];
					im[pos+step*2] = Math.floor(arr/5);
					for (j = 3; j < inner-2; j++) {
						arr = Math.max(0, arr - im[pos+(j-2)*step] + im[pos+(j+2)*step]);
						im[pos+j*step] = Math.floor(arr/5);
					}
					// j is now inner - 2 (1 bigger)
					// End of line needs special handling like start of it
					arr -= im[pos+(j-2)*step];
					im[pos+j*step] = Math.floor(arr/4);
					arr -= im[pos+(j-1)*step];
					im[pos+(j+1)*step] = Math.floor(arr/3);
				}
			}
		}
	}
	return img;
}


var wrap = document.getElementById('content'),
    elem = document.getElementById('topStories')
    width = document.documentElement.clientWidth > 500 ? 500 : document.documentElement.clientWidth,
    pos = 0, end = ( srcs.length -1 ) * width;
    

wrap.ontouchstart = function(e) {

        var startX = e.touches[0].pageX, startY = e.touches[0].pageY, 
            deltaX, time = Number(new Date()), scroll = 0;
            elem.style.webkitTransitionDuration = '0';

        ctx.putImageData(motionbluredData, 0, 0);
            
    
        this.ontouchmove = function(e) {
          deltaX = e.touches[0].pageX - startX;
          scroll = ( scroll === 0 && Math.abs(deltaX) < Math.abs(e.touches[0].pageY - startY) ) ? 2 : ( scroll !== 2 ) ? 1 : 0;
          if ( scroll === 1 ) {
            e.preventDefault();
            elem.style.webkitTransform = 'translate3d(' + (deltaX + pos) + 'px,0,0)';
          }
        }

        this.ontouchend = function(e) {

          ctx.putImageData(sharpData, 0, 0);

          pos += ( ( Number(new Date()) - time < 250 && Math.abs(deltaX) > 20 || Math.abs(deltaX) > width / 2 ) && scroll !== 2 ) ? ( deltaX + pos > 0 || Math.abs(pos) == end && end + deltaX < end ) ? 0 : ( deltaX > 0 ) ? width : -width : 0;
          elem.style.webkitTransitionDuration = '300ms';
          elem.style.webkitTransform = 'translate3d(' + pos + 'px,0,0)';
          if (!deltaX) window.location = items[ ( -pos / width ) + ( startX > width ? 1 : 0 ) ].getAttribute('data-link');
        }

}

});
