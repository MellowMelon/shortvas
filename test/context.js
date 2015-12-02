/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;
var Tracker = require("object-track");

var Shortvas = require("../index.js");
var BaseFormat = require("../lib/base_format.js");

describe("ShortvasContext", function () {
  var backingCtx;
  var shortCtx;

  beforeEach(function () {
    backingCtx = Tracker.track(BaseFormat.getStub());
    shortCtx = Shortvas.get(backingCtx);
  });

  describe("compatibility", function () {
    // Tests to verify that the shortvas behaves just like a normal context
    // except for intentional differences like chaining.

    it("should pass state changes through to underlying context", function () {
      shortCtx.strokeStyle = "#123456";
      expect(backingCtx.strokeStyle).to.equal("#123456");
    });

    it("should see changes made to underlying context", function () {
      backingCtx.strokeStyle = "#123456";
      expect(shortCtx.strokeStyle).to.equal("#123456");
    });

    it("should allow setting colors to hexadecimal numbers", function () {
      shortCtx.strokeStyle = 0x123456;
      expect(backingCtx.strokeStyle).to.equal("#123456");
    });

    it("should pass method calls through to underlying context", function () {
      shortCtx.moveTo(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });

    it("should return the shorthand context for void methods", function () {
      expect(shortCtx.moveTo(1, 2)).to.equal(shortCtx);
    });

    it("should return the usual value for nonvoid methods", function () {
      backingCtx.isPointInPath = function () {
        return true;
      };
      expect(shortCtx.isPointInPath(1, 2)).to.equal(true);
    });
  });

  it("should implement width access and assignment", function () {
    shortCtx.width = 2;
    expect(shortCtx.width).to.equal(2);
    expect(backingCtx.canvas.width).to.equal(2);
  });

  it("should implement height access and assignment", function () {
    shortCtx.height = 2;
    expect(shortCtx.height).to.equal(2);
    expect(backingCtx.canvas.height).to.equal(2);
  });

  it("should pass save calls through to underlying context", function () {
    var ret = shortCtx.save();
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "save", arguments: []},
    ]);
  });

  it("should alias push and s to save", function () {
    expect(shortCtx.push, "push").to.equal(shortCtx.save);
    expect(shortCtx.s, "s").to.equal(shortCtx.save);
  });

  it("should pass restore calls through to underlying context", function () {
    var ret = shortCtx.restore();
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "restore", arguments: []},
    ]);
  });

  it("should alias pop and r to restore", function () {
    expect(shortCtx.pop, "pop").to.equal(shortCtx.restore);
    expect(shortCtx.r, "r").to.equal(shortCtx.restore);
  });

  it("should alias addT to transform", function () {
    expect(shortCtx.addT, "addT").to.equal(shortCtx.transform);
  });

  it("should alias setT to setTransform", function () {
    expect(shortCtx.setT, "setT").to.equal(shortCtx.setTransform);
  });

  it("should alias resetT to resetTransform", function () {
    expect(shortCtx.resetT, "resetT").to.equal(shortCtx.resetTransform);
  });

  it("should forward transforms and track them via getTransform", function () {
    shortCtx.translate(1, 2).scale(2, 2).translate(3, 4);
    expect(shortCtx.getTransform()).to.deep.equal([2, 0, 0, 2, 7, 10]);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "translate", arguments: [1, 2]},
      {key: "scale", arguments: [2, 2]},
      {key: "translate", arguments: [3, 4]},
    ]);
  });

  it("should manipulate the transform stack on save and restore", function () {
    shortCtx.save().translate(1, 2).restore().translate(3, 4);
    expect(shortCtx.getTransform()).to.deep.equal([1, 0, 0, 1, 3, 4]);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "save", arguments: []},
      {key: "translate", arguments: [1, 2]},
      {key: "restore", arguments: []},
      {key: "translate", arguments: [3, 4]},
    ]);
  });

  it("should preserve transforms when restoring an empty stack", function () {
    shortCtx.translate(1, 2).restore();
    expect(shortCtx.getTransform()).to.deep.equal([1, 0, 0, 1, 1, 2]);
  });

  it("should alias getT to getTransform", function () {
    expect(shortCtx.getT, "getT").to.equal(shortCtx.getTransform);
  });

  it("should implement rotateAbout", function () {
    var ret = shortCtx.rotateAbout(1, 2, 3);
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "translate", arguments: [2, 3]},
      {key: "rotate", arguments: [1]},
      {key: "translate", arguments: [-2, -3]},
    ]);
  });

  it("should alias pivot to rotateAbout", function () {
    expect(shortCtx.pivot, "pivot").to.equal(shortCtx.rotateAbout);
  });

  it("should implement rotateDeg", function () {
    var ret = shortCtx.rotateDeg(1);
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "rotate", arguments: [Math.PI / 180]},
    ]);
  });

  it("should implement rotateAboutDeg", function () {
    var ret = shortCtx.rotateAboutDeg(1, 2, 3);
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "translate", arguments: [2, 3]},
      {key: "rotate", arguments: [Math.PI / 180]},
      {key: "translate", arguments: [-2, -3]},
    ]);
  });

  it("should alias pivotDeg to rotateAboutDeg", function () {
    expect(shortCtx.pivotDeg, "pivotDeg").to.equal(shortCtx.rotateAboutDeg);
  });

  it("should implement toRect with one argument", function () {
    var ret = shortCtx.toRect([1, 1, 2, 2]);
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "translate", arguments: [1, 1]},
      {key: "scale", arguments: [2, 2]},
      {key: "translate", arguments: [0, 0]},
    ]);
  });

  it("should implement toRect with two arguments", function () {
    var ret = shortCtx.toRect([0, 0, 1, 1], [1, 1, 2, 2]);
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "translate", arguments: [0, 0]},
      {key: "scale", arguments: [1/2, 1/2]},
      {key: "translate", arguments: [-1, -1]},
    ]);
  });

  it("should implement set", function () {
    var ret = shortCtx.set({
      strokeStyle: 0xFF0000,
      lineWidth: 2,
    });
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "strokeStyle", set: "#ff0000"},
      {key: "lineWidth", set: 2},
    ]);
  });

  it("should implement with", function () {
    var ret = shortCtx.with({
      strokeStyle: 0xFF0000,
      lineWidth: 2,
    });
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "save", arguments: []},
      {key: "strokeStyle", set: "#ff0000"},
      {key: "lineWidth", set: 2},
    ]);
  });

  it("should implement block with one argument", function () {
    var ret = shortCtx.block(function () {
      shortCtx.strokeStyle = 0xFF0000;
    });
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "save", arguments: []},
      {key: "strokeStyle", set: "#ff0000"},
      {key: "restore", arguments: []},
    ]);
  });

  it("should implement block with two arguments", function () {
    var ret = shortCtx.block({strokeStyle: 0xFF0000}, function () {
      shortCtx.scale(2, 2);
    });
    expect(ret, "return").to.equal(shortCtx);
    expect(Tracker.getActions(backingCtx)).to.deep.equal([
      {key: "save", arguments: []},
      {key: "strokeStyle", set: "#ff0000"},
      {key: "scale", arguments: [2, 2]},
      {key: "restore", arguments: []},
    ]);
  });

  it("should return a ShortvasPath instance from beginPath", function () {
    var ret = shortCtx.beginPath();
    expect(ret.M, "has M").to.exist;
    expect(ret.strokeAnd, "has strokeAnd").to.exist;
  });

  it("should alias bp to beginPath", function () {
    expect(shortCtx.bp, "bp").to.equal(shortCtx.beginPath);
  });
});
