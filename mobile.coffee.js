jQuery(function() {
  var HEIGHT, RGBA, WIDTH, canvas, context, draw, img, log, preload, _i, _len, _ref;
  log = function(msg) {
    return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
  };
  preload = function(src) {
    var img;
    img = new Image;
    img.onload = function() {
      return draw(img);
    };
    return img.src = src;
  };
  draw = function(img) {
    var imgdata;
    context.drawImage(img, 0, 0, WIDTH, HEIGHT);
    imgdata = context.getImageData(0, 0, WIDTH, HEIGHT);
    return log(imgdata.data[1]);
  };
  WIDTH = 320;
  HEIGHT = 240;
  RGBA = ['RED', 'BLUE'];
  canvas = $('#tiles').get(0);
  context = canvas.getContext('2d');
  _ref = $('img');
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    img = _ref[_i];
    preload(img.src);
  }
});
