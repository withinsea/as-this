var co = require('co')
var slice = Array.prototype.slice;

var as = module.exports = function as(self, fn) {
  if (!fn && typeof self === 'function') {
    fn = self;
    self = {};
  }
  var ret = as.call(self, fn);
  if (ret && typeof ret.then === 'function') {
    return ret.then(function () {
      return self;
    });
  } else {
    return self;
  }
};

as.call = function(self, fn) {
  if (!fn && typeof self === 'function') {
    fn = self;
    self = {};
  }
  if (!fn || typeof fn !== 'function') {
    throw new TypeError('Invalid arguments: a `this` object and a function required.');
  }
  var cons = fn.constructor;
  var args = String(fn).match(/\(\s*(.*?)\s*\)/)[1];
  var wrapped = null;
  if (cons && (cons.name === 'GeneratorFunction' || cons.displayName === 'GeneratorFunction')) {
    wrapped = co.wrap.call(self, fn);
  } else if (args === '') {
    wrapped = fn;
  } else if (!/,/.test(args)) {
    wrapped = function () {
      return new Promise(function (resolve, reject) {
        fn.call(self, function (err, res) {
          if (err) return reject(err);
          if (arguments.length > 2) res = slice.call(arguments, 1);
          resolve(res);
        });
      });
    };
  } else {
    throw new TypeError('You may only use no-args function, generator function or a thunk, '
        + 'but the following function was passed: "function (' + args + ') { .. }"');
  }
  return wrapped.apply(self);
};
