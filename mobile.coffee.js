jQuery(function() {
  var HEIGHT, RGBA, WIDTH, canvas, context, draw, img, loaded_imgs, log, motionblur, preload, total_imgs, weight, _i, _len, _ref;
  log = function(msg) {
    return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
  };
  preload = function(src) {
    var img;
    img = new Image;
    img.onload = function() {
      var blured, imgdata;
      draw(img);
      loaded_imgs.push(img);
      if (loaded_imgs.length === total_imgs) {
        imgdata = context.getImageData(0, 0, WIDTH, HEIGHT);
        blured = motionblur(imgdata, 3);
        context.putImageData(blured, 0, 0);
      }
    };
    return img.src = src;
  };
  draw = function(img) {
    return context.drawImage(img, 0, 0, WIDTH, HEIGHT);
  };
  weight = function(pixeldata, row) {
    pixeldata[row] = (pixeldata[row] + pixeldata[4 * row] + pixeldata[8 * row]) / 3;
    pixeldata[4 * row] = (pixeldata[row] + pixeldata[12 * row]) / 4;
    return pixeldata[8 * row] = (pixeldata[row] + pixeldata[16 * row]) / 5;
  };
  motionblur = function(img, passes) {
    var arr, h, i, im, inner, j, jump, k, m, n, outer, pos, rounds, step, w;
    w = img.width;
    h = img.height;
    im = img.data;
    rounds = passes || 1;
    pos = step = jump = inner = outer = arr = 0;
    n = 0;
    while (n < rounds) {
      m = 0;
      while (m < 1) {
        if (m) {
          outer = w;
          inner = h;
          step = w * 4;
        } else {
          outer = h;
          inner = w;
          step = 4;
        }
        i = 0;
        while (i < outer) {
          jump = (m === 0 ? i * w * 4 : 4 * i);
          k = 0;
          while (k < 3) {
            pos = jump + k;
            j = arr = 0;
            while (j < 5) {
              arr += im[pos + step * j];
              j++;
            }
            img[pos] = im[pos + step] = im[pos + step * 2] = Math.floor(arr / 5);
            j = 3;
            while (j < inner - 2) {
              arr = Math.max(0, arr - im[pos + (j - 2) * step] + im[pos + (j + 2) * step]);
              im[pos + j * step] = Math.floor(arr / 5);
              j++;
            }
            im[pos + j * step] = im[pos + (j + 1) * step] = Math.floor(arr / 5);
            k++;
          }
          i++;
        }
        m++;
      }
      n++;
    }
    return img;
  };
  WIDTH = 320;
  HEIGHT = 240;
  RGBA = ['RED', 'BLUE'];
  loaded_imgs = [];
  total_imgs = $('img').length;
  canvas = $('#tiles').get(0);
  context = canvas.getContext('2d');
  _ref = $('img');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    img = _ref[_i];
    preload(img.src);
  }
});
