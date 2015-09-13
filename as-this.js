var slice = Array.prototype.slice;

var as = module.exports = function() {
  var self;
  self = arguments[0];
  ret = as.call.apply(as, arguments);
  if (ret && typeof ret.then === 'function') {
    return ret.then(function () {
      return self;
    });
  } else {
    return self;
  }
};

as.call = function() {
  if (arguments.length < 2) {
    throw 'invalid arguments: a `this` object and a function required.';
  }
  var args, fn, self;
  self = arguments[0];
  fn = arguments[arguments.length - 1];
  if (typeof fn !== 'function') {
    throw 'invalid arguments: the last argument should be a function.';
  }
  args = slice.call(arguments, 1, arguments.length - 1);
  return fn.apply(self, args);
};
