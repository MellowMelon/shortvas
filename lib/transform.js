// References used to check the math:
// https://gist.github.com/abicky/3165385
// https://github.com/simonsarris/Canvas-tutorials/blob/master/transform.js

// Functions returning the matrix used for the same-named Canvas transform.

var basicTransforms = {};

basicTransforms.translate = exports.translate = function (x, y) {
  return [1, 0, 0, 1, x, y];
};

basicTransforms.rotate = exports.rotate = function (a) {
  var cos = Math.cos(a);
  var sin = Math.sin(a);
  return [cos, sin, -sin, cos, 0, 0];
};

basicTransforms.scale = exports.scale = function (x, y) {
  return [x, 0, 0, y, 0, 0];
};

basicTransforms.transform = exports.transform = function (a, b, c, d, e, f) {
  return [a, b, c, d, e, f];
};

// Functions that combine transforms.

var multiply = exports.multiply = function (m1, m2) {
  // Value [a,b,c,d,e,f] represents the 3 by 3 matrix
  // a c e
  // b d f
  // 0 0 1
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
  ];
};

// Given the current transformation matrix, a transform to apply to it, and
// its arguments as an array, return the new transformation matrix. If an
// unrecognized method is provided, returns the original matrix.
exports.process = function (m, methodName, args) {
  // Resetting transforms.
  if (methodName === "resetTransform") {
    return [1, 0, 0, 1, 0, 0];
  } else if (methodName === "setTransform") {
    return basicTransforms.transform.apply(null, args);
  // Transforms that accumulate.
  } else if (basicTransforms[methodName]) {
    return multiply(m, basicTransforms[methodName].apply(null, args));
  // Bad method name.
  } else {
    return m;
  }
};
