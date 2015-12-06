var ShortvasContext = require("./lib/context.js");
var convertColor = require("./lib/utils.js").convertColor;

exports.get = function (context) {
  if (!context || typeof context !== "object") {
    throw new Error("Shortvas.get: must pass Canvas or Context object.");
  }

  // Juggle arguments until we have context and canvas.
  if (context.getContext) {
    context = context.getContext("2d");
  }
  var canvas = context.canvas;

  // Check for a cached instance.
  if (canvas.__shortvas__) {
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
