jQuery(function() {
  var HEIGHT, RGBA, WIDTH, canvas, context, draw, img, loaded_imgs, log, motionblur, preload, total_imgs, weight, _i, _len, _ref;
  log = function(msg) {
    return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
  };
  preload = function(src) {
    var img;
    img = new Image;
    img.onload = function() {
      draw(img);
      loaded_imgs.push(img);
      if (loaded_imgs.length === total_imgs) {
        return motionblur();
      }
    };
    return img.src = src;
  };
  draw = function(img) {
    var imgdata;
    context.drawImage(img, 0, 0, WIDTH, HEIGHT);
    imgdata = context.getImageData(0, 0, WIDTH, HEIGHT);
    return log(imgdata.data[1]);
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
