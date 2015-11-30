/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;
var Tracker = require("object-track");

var Shortvas = require("../index.js");
var BaseFormat = require("../lib/base_format.js");

// For floating point tests
var TOLERANCE = 0.001;

describe("ShortvasPath", function () {
  var backingCtx;
  var shortCtx;

  beforeEach(function () {
    backingCtx = Tracker.track(BaseFormat.getStub());
    shortCtx = Shortvas.get(backingCtx);
  });

  describe("vertex API", function () {
    it("should implement moveTo", function () {
      shortCtx.bp().moveTo(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });

    it("should implement M", function () {
      shortCtx.bp().M(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });

    it("should implement m", function () {
      shortCtx.bp().M(1, 2).m(2, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "moveTo", arguments: [3, 4]},
      ]);
    });

    it("should implement lineTo", function () {
      shortCtx.bp().lineTo(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "lineTo", arguments: [1, 2]},
      ]);
    });

    it("should implement L", function () {
      shortCtx.bp().L(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "lineTo", arguments: [1, 2]},
      ]);
    });

    it("should implement l", function () {
      shortCtx.bp().M(1, 2).l(2, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [3, 4]},
      ]);
    });

    it("should implement H", function () {
      shortCtx.bp().M(1, 2).H(3);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [3, 2]},
      ]);
    });

    it("should implement h", function () {
      shortCtx.bp().M(1, 2).h(2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [3, 2]},
      ]);
    });

    it("should implement V", function () {
      shortCtx.bp().M(1, 2).V(4);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [1, 4]},
      ]);
    });

    it("should implement v", function () {
      shortCtx.bp().M(1, 2).v(2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "lineTo", arguments: [1, 4]},
      ]);
    });

    it("should implement quadraticCurveTo", function () {
      shortCtx.bp().quadraticCurveTo(1, 2, 3, 4);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "quadraticCurveTo", arguments: [1, 2, 3, 4]},
      ]);
    });

    it("should implement Q", function () {
      shortCtx.bp().Q(1, 2, 3, 4);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "quadraticCurveTo", arguments: [1, 2, 3, 4]},
      ]);
    });

    it("should implement q", function () {
      shortCtx.bp().M(1, 2).q(1, 1, 3, 3);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "quadraticCurveTo", arguments: [2, 3, 4, 5]},
      ]);
    });

    it("should implement bezierCurveTo", function () {
      shortCtx.bp().bezierCurveTo(1, 2, 3, 4, 5, 6);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "bezierCurveTo", arguments: [1, 2, 3, 4, 5, 6]},
      ]);
    });

    it("should implement C", function () {
      shortCtx.bp().C(1, 2, 3, 4, 5, 6);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "bezierCurveTo", arguments: [1, 2, 3, 4, 5, 6]},
      ]);
    });

    it("should implement c", function () {
      shortCtx.bp().M(1, 2).c(1, 1, 3, 3, 5, 5);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
        {key: "bezierCurveTo", arguments: [2, 3, 4, 5, 6, 7]},
      ]);
    });

    it("should implement rect", function () {
      shortCtx.bp().rect(1, 1, 2, 2);
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
      shortCtx.bp().arc(2, 2, 1, 6.28, 0, false);
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
      shortCtx.bp().M(2, 2).arcTo(2, 4, 4, 4, 1);
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
      shortCtx.bp().closePath();
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "closePath", arguments: []},
      ]);
    });

    it("should implement Z", function () {
      shortCtx.bp().Z();
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "closePath", arguments: []},
      ]);
    });

    it("should implement z", function () {
      shortCtx.bp().z();
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "closePath", arguments: []},
      ]);
    });

    it("should chain all vertex-pushing methods", function () {
      // Test passes if it doesn't throw.
      shortCtx.bp()
        .moveTo().M().m().lineTo().L().l().H().h().V().v()
        .quadraticCurveTo().Q().q().bezierCurveTo().C().c()
        .rect().arc().arcTo()
        .closePath().Z().z()
        .moveTo(); // Make sure the last call of the previous line chained.
    });

    it("should start at 0, 0 if first method is relative", function () {
      shortCtx.bp().m(1, 2);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "moveTo", arguments: [1, 2]},
      ]);
    });
  });

  describe("finishing API", function () {
    it("should implement stroke", function () {
      shortCtx.strokeStyle = "#FF0000";
      shortCtx.lineWidth = 1;
      var ret = shortCtx.bp().stroke("#0000FF", 2);
      expect(ret, "return").to.equal(shortCtx);
      var actionsSlice = Tracker.getActions(backingCtx).slice(3, 6);
      expect(actionsSlice).to.deep.equal([
        {key: "strokeStyle", set: "#0000FF"},
        {key: "lineWidth", set: 2},
        {key: "stroke", arguments: []},
      ]);
      expect(backingCtx.strokeStyle, "restored strokeStyle")
        .to.equal("#FF0000");
      expect(backingCtx.lineWidth, "restored lineWidth")
        .to.equal(1);
    });

    it("should implement fill", function () {
      shortCtx.fillStyle = "#CC0000";
      var ret = shortCtx.bp().fill("#0000CC", "evenodd");
      expect(ret, "return").to.equal(shortCtx);
      var actionsSlice = Tracker.getActions(backingCtx).slice(2, 4);
      expect(actionsSlice).to.deep.equal([
        {key: "fillStyle", set: "#0000CC"},
        {key: "fill", arguments: ["evenodd"]},
      ]);
      expect(backingCtx.fillStyle, "restored fillStyle")
        .to.equal("#CC0000");
    });

    it("should implement strokeFill", function () {
      shortCtx.strokeStyle = "#FF0000";
      shortCtx.lineWidth = 1;
      shortCtx.fillStyle = "#CC0000";
      var ret = shortCtx.bp().strokeFill("#0000FF", 2, "#0000CC", "evenodd");
      expect(ret, "return").to.equal(shortCtx);
      var actionsSlice = Tracker.getActions(backingCtx).slice(4, 9);
      expect(actionsSlice).to.deep.equal([
        {key: "strokeStyle", set: "#0000FF"},
        {key: "lineWidth", set: 2},
        {key: "fillStyle", set: "#0000CC"},
        {key: "stroke", arguments: []},
        {key: "fill", arguments: ["evenodd"]},
      ]);
      expect(backingCtx.strokeStyle, "restored strokeStyle")
        .to.equal("#FF0000");
      expect(backingCtx.lineWidth, "restored lineWidth")
        .to.equal(1);
      expect(backingCtx.fillStyle, "restored fillStyle")
        .to.equal("#CC0000");
    });

    it("should implement fillStroke", function () {
      shortCtx.strokeStyle = "#FF0000";
      shortCtx.lineWidth = 1;
      shortCtx.fillStyle = "#CC0000";
      var ret = shortCtx.bp().fillStroke("#0000CC", "evenodd", "#0000FF", 2);
      expect(ret, "return").to.equal(shortCtx);
      var actionsSlice = Tracker.getActions(backingCtx).slice(4, 9);
      expect(actionsSlice).to.deep.equal([
        {key: "strokeStyle", set: "#0000FF"},
        {key: "lineWidth", set: 2},
        {key: "fillStyle", set: "#0000CC"},
        {key: "fill", arguments: ["evenodd"]},
        {key: "stroke", arguments: []},
      ]);
      expect(backingCtx.strokeStyle, "restored strokeStyle")
        .to.equal("#FF0000");
      expect(backingCtx.lineWidth, "restored lineWidth")
        .to.equal(1);
      expect(backingCtx.fillStyle, "restored fillStyle")
        .to.equal("#CC0000");
    });

    it("should implement clip", function () {
      var ret = shortCtx.bp().clip("evenodd");
      expect(ret, "return").to.equal(shortCtx);
      expect(Tracker.getActions(backingCtx)).to.deep.equal([
        {key: "beginPath", arguments: []},
        {key: "clip", arguments: ["evenodd"]},
      ]);
    });
  });
});
