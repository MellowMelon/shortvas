var Transform = require("canvas-get-transform");
var BaseFormat = require("./base_format.js");
var ShortvasPathMixin = require("./path.js");
var convertColor = require("./utils.js").convertColor;

// Cached computation of degree to radian coefficient.
var DEG_TO_RAD = Math.PI / 180;

// Inspection of standard Canvas context properties and methods.

var dummyCtx = BaseFormat.getStub();
var ctxProps = [];
var ctxMethods = [];
(function () {
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
var ctxColorProps = BaseFormat.getColorProps();
var ctxTransformMethods = BaseFormat.getTransformMethods();

// Proxying utils

// Specified property name passes through to the one on the context attribute.
var proxyContextBasicProp = function (proto, name, alias) {
  Object.defineProperty(proto, alias || name, {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.context[name];
    },
    set: function (x) {
      this.context[name] = x;
    },
  });
};

// In addition to basic proxying, assignments pass through the convertColor
// utility function.
var proxyContextColorProp = function (proto, name, alias) {
  Object.defineProperty(proto, alias || name, {
    enumerable: true,
    configurable: true,
    get: function () {
      return this.context[name];
    },
    set: function (x) {
      this.context[name] = convertColor(x);
    },
  });
};

// Specified method is forwarded to the one on the context attribute.
// If no return, the original object is returned for chaining.
var proxyContextBasicMethod = function (proto, name, alias) {
  proto[alias || name] = function () {
    var ret = this.context[name].apply(this.context, arguments);
    return typeof ret === "undefined" ? this : ret;
  };
};

// In addition to basic proxying, the currentTransform attribute is modified
// according to Transform.process.
var proxyContextTransformMethod = function (proto, name, alias) {
  proto[alias || name] = function () {
    this.currentTransform = Transform.process(
      this.currentTransform, name, arguments
    );
    var ret = this.context[name].apply(this.context, arguments);
    return typeof ret === "undefined" ? this : ret;
  };
};

// ShortvasContext

var ShortvasContext = module.exports = function (context) {
  this.context = context;
  this.currentTransform = [1, 0, 0, 1, 0, 0];
  this.transformStack = [];
  this.x = 0;
  this.y = 0;
};

var sCtxProto = ShortvasContext.prototype;

// ShortvasContext gets the same properties a standard canvas does.
ctxProps.forEach(function (name) {
  if (ctxColorProps.indexOf(name) > -1) {
    proxyContextColorProp(sCtxProto, name);
  } else {
    proxyContextBasicProp(sCtxProto, name);
  }
});

// ShortvasContext gets the same methods a standard canvas does.
ctxMethods.forEach(function (name) {
  if (ctxTransformMethods.indexOf(name) > -1) {
    proxyContextTransformMethod(sCtxProto, name);
  } else {
    proxyContextBasicMethod(sCtxProto, name);
  }
});

// Proxies to canvas width and height

Object.defineProperty(sCtxProto, "width", {
  enumerable: true,
  configurable: true,
  get: function () {
    return this.context.canvas.width;
  },
  set: function (x) {
    this.context.canvas.width = x;
  },
});

Object.defineProperty(sCtxProto, "height", {
  enumerable: true,
  configurable: true,
  get: function () {
    return this.context.canvas.height;
  },
  set: function (x) {
    this.context.canvas.height = x;
  },
});

// State stack

sCtxProto.save = function () {
  this.transformStack.push(this.currentTransform);
  this.context.save();
  return this;
};
// Aliases
sCtxProto.push = sCtxProto.save;
sCtxProto.sv = sCtxProto.save;

sCtxProto.restore = function () {
  // restore is a noop when the state stack is empty:
  // https://html.spec.whatwg.org/multipage/scripting.html#dom-context-2d-restore
  this.currentTransform = this.transformStack.pop() || this.currentTransform;
  this.context.restore();
  return this;
};
// Aliases
sCtxProto.pop = sCtxProto.restore;
sCtxProto.rs = sCtxProto.restore;

// Transforms

// Basic aliases
sCtxProto.addT = sCtxProto.transform;
sCtxProto.setT = sCtxProto.setTransform;

sCtxProto.resetTransform = function () {
  if (this.context.resetTransform) {
    this.context.resetTransform();
  } else {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }
  return this;
};
// Aliases
sCtxProto.resetT = sCtxProto.resetTransform;

sCtxProto.getTransform = function () {
  return this.currentTransform;
};
// Aliases
sCtxProto.getT = sCtxProto.getTransform;

sCtxProto.rotateAbout = function (angle, x, y) {
  this.translate(x, y);
  this.rotate(angle);
  this.translate(-x, -y);
  return this;
};
// Aliases
sCtxProto.pivot = sCtxProto.rotateAbout;

sCtxProto.rotateDeg = function (angleDeg) {
  this.rotate(angleDeg * DEG_TO_RAD);
  return this;
};

sCtxProto.rotateAboutDeg = function (angleDeg, x, y) {
  this.rotateAbout(angleDeg * DEG_TO_RAD, x, y);
  return this;
};
// Aliases
sCtxProto.pivotDeg = sCtxProto.rotateAboutDeg;

sCtxProto.toRect = function (fromRect, toRect) {
  toRect = toRect || [0, 0, 1, 1];
  this.context.translate(fromRect[0], fromRect[1]);
  this.context.scale(fromRect[2] / toRect[2], fromRect[3] / toRect[3]);
  this.context.translate(-toRect[0] || 0, -toRect[1] || 0);
  return this;
};

// State machine wrappers

sCtxProto.set = function (props) {
  for (var k in props) {
    if (props.hasOwnProperty(k)) {
      this[k] = props[k];
    }
  }
  return this;
};

sCtxProto.with = function (props) {
  this.save();
  this.set(props);
  return this;
};

sCtxProto.block = function (props, f) {
  this.save();
  if (!f) {
    f = props;
  } else {
    this.set(props);
  }
  f();
  this.restore();
  return this;
};

// Path mixin

(function () {
  for (var k in ShortvasPathMixin) {
    if (ShortvasPathMixin.hasOwnProperty(k)) {
      sCtxProto[k] = ShortvasPathMixin[k];
    }
  }
}());

// Misc

sCtxProto.blank = function (color) {
  this.save().resetT().bp()
    .rect(0, 0, this.width, this.height).fill(color)
  .restore();
  return this;
};

sCtxProto.clear = function () {
  this.save().resetT()
    .clearRect(0, 0, this.width, this.height)
  .restore();
  return this;
};
