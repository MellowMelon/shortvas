/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;
var Tracker = require("object-track");

var Shortvas = require("../index.js");
var BaseFormat = require("../lib/base_format.js");

// For floating point tests
var TOLERANCE = 0.001;

describe("ShortvasContext path methods", function () {
  var backingCtx;
  var shortCtx;

  beforeEach(function () {
    backingCtx = Tracker.track(BaseFormat.getStub());
    shortCtx = Shortvas.get(backingCtx);
  });

  it("should alias bp to beginPath", function () {
    expect(shortCtx.bp, "bp").to.equal(shortCtx.beginPath);
  });

  describe("vertex API", function () {
    it("should implement moveTo", function () {
      var ret = shortCtx.bp().moveTo(1, 2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });

    it("should alias M to moveTo", function () {
      expect(shortCtx.M, "M").to.equal(shortCtx.moveTo);
    });

    it("should implement aliases even without bp.", function () {
      expect(shortCtx.M, "M").to.equal(shortCtx.moveTo);
    });

    it("should implement m", function () {
      var ret = shortCtx.bp().M(1, 2).m(2, 2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "moveTo", arguments: [3, 4]},
      ]);
    });

    it("should implement lineTo", function () {
      var ret = shortCtx.bp().lineTo(1, 2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "lineTo", arguments: [1, 2]},
      ]);
    });

    it("should alias L to lineTo", function () {
      expect(shortCtx.L, "L").to.equal(shortCtx.lineTo);
    });

    it("should implement l", function () {
      var ret = shortCtx.bp().M(1, 2).l(2, 2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [3, 4]},
      ]);
    });

    it("should implement H", function () {
      var ret = shortCtx.bp().M(1, 2).H(3);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [3, 2]},
      ]);
    });

    it("should implement h", function () {
      var ret = shortCtx.bp().M(1, 2).h(2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [3, 2]},
      ]);
    });

    it("should implement V", function () {
      var ret = shortCtx.bp().M(1, 2).V(4);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [1, 4]},
      ]);
    });

    it("should implement v", function () {
      var ret = shortCtx.bp().M(1, 2).v(2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [1, 4]},
      ]);
    });

    it("should implement quadraticCurveTo", function () {
      var ret = shortCtx.bp().quadraticCurveTo(1, 2, 3, 4);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "quadraticCurveTo", arguments: [1, 2, 3, 4]},
      ]);
    });

    it("should alias Q to quadraticCurveTo", function () {
      expect(shortCtx.Q, "Q").to.equal(shortCtx.quadraticCurveTo);
    });

    it("should implement q", function () {
      var ret = shortCtx.bp().M(1, 2).q(1, 1, 3, 3);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "quadraticCurveTo", arguments: [2, 3, 4, 5]},
      ]);
    });

    it("should implement bezierCurveTo", function () {
      var ret = shortCtx.bp().bezierCurveTo(1, 2, 3, 4, 5, 6);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "bezierCurveTo", arguments: [1, 2, 3, 4, 5, 6]},
      ]);
    });

    it("should alias C to bezierCurveTo", function () {
      expect(shortCtx.C, "C").to.equal(shortCtx.bezierCurveTo);
    });

    it("should implement c", function () {
      var ret = shortCtx.bp().M(1, 2).c(1, 1, 3, 3, 5, 5);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "bezierCurveTo", arguments: [2, 3, 4, 5, 6, 7]},
      ]);
    });

    it("should implement rect", function () {
      var ret = shortCtx.bp().rect(1, 1, 2, 2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "rect", arguments: [1, 1, 2, 2]},
      ]);
    });

    it("should set the position after rect", function () {
      shortCtx.bp().rect(1, 1, 2, 2).l(0, 0);
      var finalCoords = Tracker.getActions(backingCtx)[2].arguments;
      expect(finalCoords[0]).to.be.within(1 - TOLERANCE, 1 + TOLERANCE);
      expect(finalCoords[1]).to.be.within(1 - TOLERANCE, 1 + TOLERANCE);
    });

    it("should implement arc", function () {
      var ret = shortCtx.bp().arc(2, 2, 1, 6.28, 0, false);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "arc", arguments: [2, 2, 1, 6.28, 0, false]},
      ]);
    });

    it("should set the position after arc", function () {
      shortCtx.bp().arc(2, 2, 1, 6.28, 0, false).l(0, 0);
      var finalCoords = Tracker.getActions(backingCtx)[2].arguments;
      expect(finalCoords[0]).to.be.within(3 - TOLERANCE, 3 + TOLERANCE);
      expect(finalCoords[1]).to.be.within(2 - TOLERANCE, 2 + TOLERANCE);
    });

    it("should implement arcTo", function () {
      var ret = shortCtx.bp().M(2, 2).arcTo(2, 4, 4, 4, 1);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [2, 2]},
        {key: "arcTo", arguments: [2, 4, 4, 4, 1]},
      ]);
    });

    it("should set the position after arcTo for right angles", function () {
      shortCtx.bp().M(2, 2).arcTo(2, 4, 4, 4, 1).l(0, 0);
      var finalCoords = Tracker.getActions(backingCtx)[3].arguments;
      expect(finalCoords[0]).to.be.within(3 - TOLERANCE, 3 + TOLERANCE);
      expect(finalCoords[1]).to.be.within(4 - TOLERANCE, 4 + TOLERANCE);
    });

    it("should set the position after arcTo for acute angles", function () {
      shortCtx.bp().M(2, 2).arcTo(8, 10, 11, 6, 30 / 4).l(0, 0);
      var finalCoords = Tracker.getActions(backingCtx)[3].arguments;
      expect(finalCoords[0]).to.be.within(14 - TOLERANCE, 14 + TOLERANCE);
      expect(finalCoords[1]).to.be.within(2 - TOLERANCE, 2 + TOLERANCE);
    });

    it("should set the position after arcTo for obtuse angles", function () {
      shortCtx.bp().M(2, 2).arcTo(8, 10, 5, 14, 40 / 3).l(0, 0);
      var finalCoords = Tracker.getActions(backingCtx)[3].arguments;
      expect(finalCoords[0]).to.be.within(2 - TOLERANCE, 2 + TOLERANCE);
      expect(finalCoords[1]).to.be.within(18 - TOLERANCE, 18 + TOLERANCE);
    });

    it("should implement closePath", function () {
      var ret = shortCtx.bp().closePath();
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "closePath", arguments: []},
      ]);
    });

    it("should alias Z and z to closePath", function () {
      expect(shortCtx.Z, "Z").to.equal(shortCtx.closePath);
      expect(shortCtx.z, "z").to.equal(shortCtx.closePath);
    });

    it("should start at 0, 0 if first method is relative", function () {
      shortCtx.bp().m(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });

    it("should start at 0, 0 after every beginPath call", function () {
      shortCtx.bp().M(1, 2).bp().m(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });

    it("should flatten one level of arrays in arguments", function () {
      shortCtx.bp()
        .M([1, 2])
        .L([1], 2)
        .Q([1, 2], [3, 4])
        .C([1, 2], 3, [4, 5, 6])
        .arcTo([1, 2, 3, 4, 5]);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [1, 2]},
        {key: "quadraticCurveTo", arguments: [1, 2, 3, 4]},
        {key: "bezierCurveTo", arguments: [1, 2, 3, 4, 5, 6]},
        {key: "arcTo", arguments: [1, 2, 3, 4, 5]},
      ]);
    });
  });

  describe("finishing API", function () {
    it("should implement stroke", function () {
      var ret = shortCtx.bp().stroke(0x0000FF, 2);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "strokeStyle", set: "#0000ff"},
        {key: "lineWidth", set: 2},
        {key: "stroke", arguments: []},
      ]);
    });

    it("should implement stroke with missing arguments", function () {
      shortCtx.strokeStyle = 0x0000FF;
      var ret = shortCtx.bp().stroke(null, null);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "strokeStyle", set: "#0000ff"},
        {key: "beginPath", arguments: []},
        {key: "stroke", arguments: []},
      ]);
    });

    it("should implement fill", function () {
      var ret = shortCtx.bp().fill(0x0000CC, "evenodd");
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "fillStyle", set: "#0000cc"},
        {key: "fill", arguments: ["evenodd"]},
      ]);
    });

    it("should implement fill with missing arguments", function () {
      shortCtx.fillStyle = 0x0000CC;
      var ret = shortCtx.bp().fill(null, null);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "fillStyle", set: "#0000cc"},
        {key: "beginPath", arguments: []},
        {key: "fill", arguments: []},
      ]);
    });

    it("should implement clip", function () {
      var ret = shortCtx.bp().clip("evenodd");
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "clip", arguments: ["evenodd"]},
      ]);
    });

    it("should implement clip with missing arguments", function () {
      var ret = shortCtx.bp().clip(null);
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "clip", arguments: []},
      ]);
    });
  });
});
