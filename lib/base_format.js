// File with all relevant details of how a usual Canvas Context works, like
// supported properties or methods.

// Function returning an object that mimics a Canvas context in terms of
// existing keys, methods, types, and default values.
exports.getStub = function () {
  // Based off of https://html.spec.whatwg.org/multipage/scripting.html#canvasrenderingcontext2d
  // and things implemented by Chrome 46.0.2490.80.
  var context = {
    canvas: {
      width: 0,
      height: 0,
      getContext: function () {
        return context;
      },
    },
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    strokeStyle: "#000000",
    fillStyle: "#000000",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    lineWidth: 1,
    lineCap: "butt",
    lineJoin: "miter",
    miterLimit: 10,
    lineDashOffset: 0,
    font: "10px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic",
    save: function () {},
    restore: function () {},
    scale: function () {},
    rotate: function () {},
    translate: function () {},
    transform: function () {},
    setTransform: function () {},
    resetTransform: function () {},
    createLinearGradient: function () {},
    createRadialGradient: function () {},
    createPattern: function () {},
    clearRect: function () {},
    fillRect: function () {},
    strokeRect: function () {},
    beginPath: function () {},
    fill: function () {},
    stroke: function () {},
    drawFocusIfNeeded: function () {},
    clip: function () {},
    isPointInPath: function () {},
    isPointInStroke: function () {},
    fillText: function () {},
    strokeText: function () {},
    measureText: function () {},
    drawImage: function () {},
    createImageData: function () {},
    getImageData: function () {},
    putImageData: function () {},
    getContextAttributes: function () {},
    setLineDash: function () {},
    getLineDash: function () {},
    closePath: function () {},
    moveTo: function () {},
    lineTo: function () {},
    quadraticCurveTo: function () {},
    bezierCurveTo: function () {},
    arcTo: function () {},
    rect: function () {},
    arc: function () {},
  };
  return context;
};

exports.getColorProps = function () {
  return [
    "strokeStyle",
    "fillStyle",
    "shadowColor",
  ];
};

// List of methods that alter the transformation matrix and need to be
// augmented with tracking to implement a getTransform method.
// save+restore not included since those require more than just the current
// transformation to deal with.
exports.getTransformMethods = function () {
  return [
    "scale",
    "rotate",
    "translate",
    "transform",
    "setTransform",
    "resetTransform",
  ];
};
