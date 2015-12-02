var convertColor = require("./utils.js").convertColor;

var ShortvasPath = module.exports = function (shortvas) {
  this.shortvas = shortvas;
  this.context = shortvas.context;
  this.x = 0;
  this.y = 0;
};

var sPathProto = ShortvasPath.prototype;

// Vertex methods

sPathProto.moveTo = function (x, y) {
  this.x = x;
  this.y = y;
  this.context.moveTo(x, y);
  return this;
};
// Relative version
sPathProto.m = function (dx, dy) {
  return this.moveTo(this.x + dx, this.y + dy);
};
// Aliases
sPathProto.M = sPathProto.moveTo;

sPathProto.lineTo = function (x, y) {
  this.x = x;
  this.y = y;
  this.context.lineTo(x, y);
  return this;
};
// Relative version
sPathProto.l = function (dx, dy) {
  return this.lineTo(this.x + dx, this.y + dy);
};
// Aliases
sPathProto.L = sPathProto.lineTo;

sPathProto.closePath = function () {
  this.context.closePath();
  return this;
};
// Aliases
sPathProto.Z = sPathProto.closePath;
sPathProto.z = sPathProto.closePath;

sPathProto.H = function (x) {
  this.x = x;
  this.context.lineTo(x, this.y);
  return this;
};
// Relative version
sPathProto.h = function (dx) {
  return this.H(this.x + dx);
};

sPathProto.V = function (y) {
  this.y = y;
  this.context.lineTo(this.x, y);
  return this;
};
// Relative version
sPathProto.v = function (dy) {
  return this.V(this.y + dy);
};

sPathProto.quadraticCurveTo = function (cpx, cpy, x, y) {
  this.x = x;
  this.y = y;
  this.context.quadraticCurveTo(cpx, cpy, x, y);
  return this;
};
// Relative version
sPathProto.q = function (dcpx, dcpy, dx, dy) {
  return this.quadraticCurveTo(
    this.x + dcpx, this.y + dcpy,
    this.x + dx, this.y + dy
  );
};
// Aliases
sPathProto.Q = sPathProto.quadraticCurveTo;

sPathProto.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
  this.x = x;
  this.y = y;
  this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  return this;
};
// Relative version
sPathProto.c = function (dcp1x, dcp1y, dcp2x, dcp2y, dx, dy) {
  return this.bezierCurveTo(
    this.x + dcp1x, this.y + dcp1y,
    this.x + dcp2x, this.y + dcp2y,
    this.x + dx, this.y + dy
  );
};
// Aliases
sPathProto.C = sPathProto.bezierCurveTo;

sPathProto.rect = function (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.context.rect(x, y, width, height);
  return this;
};

sPathProto.arc = function (x, y, r, start, end, ccw) {
  this.x = x + r * Math.cos(end);
  this.y = y - r * Math.sin(end);
  this.context.arc(x, y, r, start, end, ccw);
  return this;
};

sPathProto.arcTo = function (cp1x, cp1y, cp2x, cp2y, r) {
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
};

// Finishing methods

sPathProto.strokeAnd = function (stroke, width) {
  if (stroke != null) {
    this.context.strokeStyle = convertColor(stroke);
  }
  if (width != null) {
    this.context.lineWidth = parseFloat(width);
  }
  this.context.stroke();
  return this;
};

sPathProto.fillAnd = function (fill, rule) {
  if (fill != null) {
    this.context.fillStyle = convertColor(fill);
  }
  this.context.fill(rule);
  return this;
};

sPathProto.clipAnd = function (rule) {
  this.context.clip(rule);
  return this;
};

sPathProto.stroke = function (stroke, width) {
  return this.strokeAnd(stroke, width).shortvas;
};

sPathProto.fill = function (fill, rule) {
  return this.fillAnd(fill, rule).shortvas;
};

sPathProto.clip = function (rule) {
  return this.clipAnd(rule).shortvas;
};
