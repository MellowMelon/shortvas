var convertColor = require("./utils.js").convertColor;
var flatten = require("./utils.js").flatten;

// Given a function, return a transformed version where the passed arguments
// are flattened before calling.
var liftFlatten = function (f) {
  return function () {
    return f.apply(this, flatten(arguments));
  };
};

// Mixin that can be merged with a prototype.
var sPathMixin = module.exports = {};

// Begin methods

sPathMixin.beginPath = function () {
  this.context.beginPath();
  this.x = 0;
  this.y = 0;
  return this;
};
sPathMixin.bp = sPathMixin.beginPath;

// Vertex methods

sPathMixin.moveTo = liftFlatten(function (x, y) {
  this.x = x;
  this.y = y;
  this.context.moveTo(x, y);
  return this;
});
// Relative version
sPathMixin.m = liftFlatten(function (dx, dy) {
  return this.moveTo(this.x + dx, this.y + dy);
});
// Aliases
sPathMixin.M = sPathMixin.moveTo;

sPathMixin.lineTo = liftFlatten(function (x, y) {
  this.x = x;
  this.y = y;
  this.context.lineTo(x, y);
  return this;
});
// Relative version
sPathMixin.l = liftFlatten(function (dx, dy) {
  return this.lineTo(this.x + dx, this.y + dy);
});
// Aliases
sPathMixin.L = sPathMixin.lineTo;

sPathMixin.closePath = liftFlatten(function () {
  this.context.closePath();
  return this;
});
// Aliases
sPathMixin.Z = sPathMixin.closePath;
sPathMixin.z = sPathMixin.closePath;

sPathMixin.H = liftFlatten(function (x) {
  this.x = x;
  this.context.lineTo(x, this.y);
  return this;
});
// Relative version
sPathMixin.h = liftFlatten(function (dx) {
  return this.H(this.x + dx);
});

sPathMixin.V = liftFlatten(function (y) {
  this.y = y;
  this.context.lineTo(this.x, y);
  return this;
});
// Relative version
sPathMixin.v = liftFlatten(function (dy) {
  return this.V(this.y + dy);
});

sPathMixin.quadraticCurveTo = liftFlatten(function (cpx, cpy, x, y) {
  this.x = x;
  this.y = y;
  this.context.quadraticCurveTo(cpx, cpy, x, y);
  return this;
});
// Relative version
sPathMixin.q = liftFlatten(function (dcpx, dcpy, dx, dy) {
  return this.quadraticCurveTo(
    this.x + dcpx, this.y + dcpy,
    this.x + dx, this.y + dy
  );
});
// Aliases
sPathMixin.Q = sPathMixin.quadraticCurveTo;

sPathMixin.bezierCurveTo = liftFlatten(function (cp1x, cp1y, cp2x, cp2y, x, y) {
  this.x = x;
  this.y = y;
  this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  return this;
});
// Relative version
sPathMixin.c = liftFlatten(function (dcp1x, dcp1y, dcp2x, dcp2y, dx, dy) {
  return this.bezierCurveTo(
    this.x + dcp1x, this.y + dcp1y,
    this.x + dcp2x, this.y + dcp2y,
    this.x + dx, this.y + dy
  );
});
// Aliases
sPathMixin.C = sPathMixin.bezierCurveTo;

sPathMixin.rect = liftFlatten(function (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.context.rect(x, y, width, height);
  return this;
});

sPathMixin.arc = liftFlatten(function (x, y, r, start, end, ccw) {
  this.x = x + r * Math.cos(end);
  this.y = y - r * Math.sin(end);
  this.context.arc(x, y, r, start, end, ccw);
  return this;
});

sPathMixin.arcTo = liftFlatten(function (cp1x, cp1y, cp2x, cp2y, r) {
  // arcTo's algorithm explained at:
  // http://www.dbp-consulting.com/tutorials/canvas/CanvasArcTo.html
  // Is the angle between the points acute? Done via dot product.
  var isAcute = 0 < (this.x - cp1x) * (cp2x - cp1x) +
    (this.y - cp1y) * (cp2y - cp1y);
  // Compute the angle between the two lines the circle is tangent to.
  var angStart = Math.atan2(this.y - cp1y, this.x - cp1x);
  var angEnd = Math.atan2(cp2y - cp1y, cp2x - cp1x);
  var ang = (angEnd - angStart + 2 * Math.PI) % Math.PI;
  if (isAcute === ang > Math.PI / 2) {
    ang = Math.PI - ang;
  }
  // Distance between cp1 and cp2.
  var cp2d = Math.sqrt(Math.pow(cp2x - cp1x, 2) + Math.pow(cp2y - cp1y, 2));
  // Compute the radius of the circle tangent to both lines at cp2.
  var cp2r = Math.tan(ang / 2) * cp2d;
  // Compute the final coordinates.
  this.x = cp1x + (cp2x - cp1x) * r / cp2r;
  this.y = cp1y + (cp2y - cp1y) * r / cp2r;
  this.context.arcTo(cp1x, cp1y, cp2x, cp2y, r);
  return this;
});

// Finishing methods

sPathMixin.stroke = function (stroke, width) {
  if (stroke != null) {
    this.context.strokeStyle = convertColor(stroke);
  }
  if (width != null) {
    this.context.lineWidth = parseFloat(width);
  }
  this.context.stroke();
  return this;
};

sPathMixin.fill = function (fill, rule) {
  if (fill != null) {
    this.context.fillStyle = convertColor(fill);
  }
  var args = rule != null ? [rule] : [];
  this.context.fill.apply(this.context, args);
  return this;
};

sPathMixin.clip = function (rule) {
  var args = rule != null ? [rule] : [];
  this.context.clip.apply(this.context, args);
  return this;
};
