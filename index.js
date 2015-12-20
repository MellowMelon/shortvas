var ShortvasContext = require("./lib/context.js");
var convertColor = require("./lib/utils.js").convertColor;

exports.get = function (context, options) {
  if (!context || typeof context !== "object") {
    throw new Error("Shortvas.get: must pass Canvas or Context object.");
  }
  options = options || {};

  // Juggle arguments until we have context and canvas.
  if (context.getContext) {
    context = context.getContext("2d");
  }
  var canvas = context.canvas;

  // Check for a cached instance.
  if (canvas.__shortvas__ && !options.noCache) {
    return canvas.__shortvas__;
  }

  var shortvasContext = new ShortvasContext(context);
  canvas.__shortvas__ = shortvasContext;
  return shortvasContext;
};

exports.color = convertColor;

exports.extend = function (methods) {
  for (var k in methods) {
    if (methods.hasOwnProperty(k)) {
      if (typeof methods[k] === "function") {
        ShortvasContext.prototype[k] = methods[k];
      }
    }
  }
};
