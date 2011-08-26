jQuery(function() {
  var HEIGHT, RGBA, WIDTH, bluur, canvas, context, draw, img, loaded_imgs, log, motionblur, preload, total_imgs, weight, _i, _len, _ref;
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
        blured = bluur(imgdata);
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
  motionblur = function() {
    var blur, imagedata, pixeldata, pos, row, _fn;
    blur = 0;
    pos = 0;
    imagedata = context.getImageData(0, 0, WIDTH, HEIGHT);
    pixeldata = imagedata.data;
    _fn = function() {
      var pixel, _ref, _results;
      blur = weight(pixeldata, row);
      _results = [];
      for (pixel = 3, _ref = pixeldata.length - 2; pixel <= _ref; pixel += 4) {
        _results.push((function() {
          blur = Math.max(0, blur - pixeldata[row + (pixel - 2)] + pixeldata[row + (pixel + 2)]);
          return pixeldata[row + (pixel + 1)] = Math.floor(blur / 5);
        })());
      }
      return _results;
    };
    for (row = 0; 0 <= HEIGHT ? row <= HEIGHT : row >= HEIGHT; 0 <= HEIGHT ? row++ : row--) {
      _fn();
    }
    return context.putImageData(imagedata, 0, 0);
  };
  bluur = function(img, passes) {
    var arr, h, i, im, inner, j, jump, k, n, outer, pos, rounds, step, w, _ref, _ref2, _ref3;
    pos = 0;
    rounds = passes || 1;
    h = img.height;
    w = img.width;
    im = img.data;
    for (n = 0, _ref = rounds - 1; 0 <= _ref ? n <= _ref : n >= _ref; 0 <= _ref ? n++ : n--) {
      outer = h;
      inner = w;
      step = 4;
      for (i = 0, _ref2 = outer - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        jump = 4 * i;
        for (k = 0; k <= 2; k++) {
          pos = jump + k;
          arr = 0;
          for (j = 0; j <= 4; j++) {
            arr += im[pos + step * j];
          }
          img[pos] = im[pos + step] = im[pos + step * 2] = Math.floor(arr / 5);
          for (j = 3, _ref3 = inner - 3; 3 <= _ref3 ? j <= _ref3 : j >= _ref3; 3 <= _ref3 ? j++ : j--) {
            arr = Math.max(0, arr - im[pos + (j - 2) * step] + im[pos + (j + 2) * step]);
            im[pos + j * step] = Math.floor(arr / 5);
          }
          im[pos + j * step] = im[pos + (j + 1) * step] = Math.floor(arr / 5);
        }
      }
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
