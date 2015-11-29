var convertColor = require("./utils.js").convertColor;

var ShortvasPath = module.exports = function (shortvas) {
  this.shortvas = shortvas;
  this.context = shortvas.context;
  this.x = 0;
  this.y = 0;
};

// Vertex methods

ShortvasPath.prototype.moveTo = function (x, y) {
  this.x = x;
  this.y = y;
  this.context.moveTo(x, y);
  return this;
};
// Relative version
ShortvasPath.prototype.m = function (dx, dy) {
  return this.moveTo(this.x + dx, this.y + dy);
};
// Aliases
ShortvasPath.prototype.M = ShortvasPath.prototype.moveTo;

ShortvasPath.prototype.lineTo = function (x, y) {
  this.x = x;
  this.y = y;
  this.context.lineTo(x, y);
  return this;
};
// Relative version
ShortvasPath.prototype.l = function (dx, dy) {
  return this.lineTo(this.x + dx, this.y + dy);
};
// Aliases
ShortvasPath.prototype.L = ShortvasPath.prototype.lineTo;

ShortvasPath.prototype.closePath = function () {
  this.context.closePath();
  return this;
};
// Aliases
ShortvasPath.prototype.Z = ShortvasPath.prototype.closePath;
ShortvasPath.prototype.z = ShortvasPath.prototype.closePath;

ShortvasPath.prototype.H = function (x) {
  this.x = x;
  this.context.lineTo(x, this.y);
  return this;
};
// Relative version
ShortvasPath.prototype.h = function (dx) {
  return this.H(this.x + dx);
};

ShortvasPath.prototype.V = function (y) {
  this.y = y;
  this.context.lineTo(this.x, y);
  return this;
};
// Relative version
ShortvasPath.prototype.v = function (dy) {
  return this.V(this.y + dy);
};

ShortvasPath.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
  this.x = x;
  this.y = y;
  this.context.quadraticCurveTo(cpx, cpy, x, y);
  return this;
};
// Relative version
ShortvasPath.prototype.q = function (dcpx, dcpy, dx, dy) {
  return this.quadraticCurveTo(
    this.x + dcpx, this.y + dcpy,
    this.x + dx, this.y + dy
  );
};
// Aliases
ShortvasPath.prototype.Q = ShortvasPath.prototype.quadraticCurveTo;

ShortvasPath.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
  this.x = x;
  this.y = y;
  this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  return this;
};
// Relative version
ShortvasPath.prototype.c = function (dcp1x, dcp1y, dcp2x, dcp2y, dx, dy) {
  return this.bezierCurveTo(
    this.x + dcp1x, this.y + dcp1y,
    this.x + dcp2x, this.y + dcp2y,
    this.x + dx, this.y + dy
  );
};
// Aliases
ShortvasPath.prototype.C = ShortvasPath.prototype.bezierCurveTo;

ShortvasPath.prototype.rect = function (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.context.rect(x, y, width, height);
  return this;
};

ShortvasPath.prototype.arc = function (x, y, r, start, end, ccw) {
  this.x = x + r * Math.cos(end);
  this.y = y - r * Math.sin(end);
  this.context.arc(x, y, r, start, end, ccw);
  return this;
};

ShortvasPath.prototype.arcTo = function (cp1x, cp1y, cp2x, cp2y, r) {
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

ShortvasPath.prototype.stroke = function (stroke, width) {
  stroke = convertColor(stroke);
  width = parseFloat(width);
  var origStroke = this.context.strokeStyle;
  var origWidth = this.context.lineWidth;
  this.context.strokeStyle = typeof stroke === "string" ? stroke : origStroke;
  this.context.lineWidth = width || origWidth;
  this.context.stroke();
  this.context.strokeStyle = origStroke;
  this.context.lineWidth = origWidth;
  return this.shortvas;
};

ShortvasPath.prototype.fill = function (fill, rule) {
  fill = convertColor(fill);
  var origFill = this.context.fillStyle;
  this.context.fillStyle = typeof fill === "string" ? fill : origFill;
  this.context.fill(rule);
  this.context.fillStyle = origFill;
  return this.shortvas;
};

ShortvasPath.prototype.strokeFill = function (stroke, width, fill, rule) {
  stroke = convertColor(stroke);
  width = parseFloat(width);
  fill = convertColor(fill);
  var origStroke = this.context.strokeStyle;
  var origWidth = this.context.lineWidth;
  var origFill = this.context.fillStyle;
  this.context.strokeStyle = typeof stroke === "string" ? stroke : origStroke;
  this.context.lineWidth = width || origWidth;
  this.context.fillStyle = typeof fill === "string" ? fill : origFill;
  this.context.stroke();
  this.context.fill(rule);
  this.context.strokeStyle = origStroke;
  this.context.lineWidth = origWidth;
  this.context.fillStyle = origFill;
  return this.shortvas;
};

ShortvasPath.prototype.fillStroke = function (fill, rule, stroke, width) {
  stroke = convertColor(stroke);
  width = parseFloat(width);
  fill = convertColor(fill);
  var origStroke = this.context.strokeStyle;
  var origWidth = this.context.lineWidth;
  var origFill = this.context.fillStyle;
  this.context.strokeStyle = typeof stroke === "string" ? stroke : origStroke;
  this.context.lineWidth = width || origWidth;
  this.context.fillStyle = typeof fill === "string" ? fill : origFill;
  this.context.fill(rule);
  this.context.stroke();
  this.context.strokeStyle = origStroke;
  this.context.lineWidth = origWidth;
  this.context.fillStyle = origFill;
  return this.shortvas;
};
