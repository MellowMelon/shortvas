var BaseFormat = require("./base_format.js");
var ShortvasPath = require("./path.js");
var convertColor = require("./utils.js").convertColor;

// Inspection of standard Canvas context properties and methods.

var dummyCtx = BaseFormat.getStub();
var ctxProps = [];
var ctxMethods = [];
(function(){
  for (var k in dummyCtx) {
    if (!dummyCtx.hasOwnProperty(k)) {
      //
    } else if (typeof dummyCtx[k] === "function") {
      ctxMethods.push(k);
    } else {
      ctxProps.push(k);
    }
  }
}());
ctxColorProps = BaseFormat.getColorProps();

// ShortvasContext

var ShortvasContext = module.exports = function (context) {
  this.context = context;
};

// Proxy all the standard canvas properties.
ctxProps.forEach(function (name) {
  Object.defineProperty(ShortvasContext.prototype, name, {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.context[name];
    },
    set: function (x) {
      this.context[name] = x;
    },
  });
});

// Further modify color properties to pass through convertColor.
ctxColorProps.forEach(function (name) {
  Object.defineProperty(ShortvasContext.prototype, name, {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.context[name];
    },
    set: function (x) {
      this.context[name] = convertColor(x);
    },
  });
});

// Proxy all the standard canvas methods on the prototype, and allow chaining
// for void methods.
ctxMethods.forEach(function (name) {
  ShortvasContext.prototype[name] = function () {
    var ret = this.context[name].apply(this.context, arguments);
    return typeof ret === "undefined" ? this : ret;
  };
});

ShortvasContext.prototype.block = function (f) {
  this.context.save();
  f();
  this.context.restore();
  return this;
};

ShortvasContext.prototype.bp = function () {
  this.context.beginPath();
  return new ShortvasPath(this);
};
