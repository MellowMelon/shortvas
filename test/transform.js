/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;

var Transform = require("../lib/transform.js");

// For floating point tests
var TOLERANCE = 0.001;

describe("Transform utils", function () {
  it("should give the right matrix for translate", function () {
    expect(Transform.translate(1, 2)).to.deep.equal([1, 0, 0, 1, 1, 2]);
  });

  it("should give the right matrix for rotate", function () {
    var m = Transform.rotate(2 * Math.PI / 3);
    var rt3 = Math.sqrt(3);
    expect(m[0]).to.be.within(-0.5 - TOLERANCE, -0.5 + TOLERANCE);
    expect(m[1]).to.be.within(rt3/2 - TOLERANCE, rt3/2 + TOLERANCE);
    expect(m[2]).to.be.within(-rt3/2 - TOLERANCE, -rt3/2 + TOLERANCE);
    expect(m[3]).to.be.within(-0.5 - TOLERANCE, -0.5 + TOLERANCE);
  });

  it("should give the right matrix for scale", function () {
    expect(Transform.scale(2, 3)).to.deep.equal([2, 0, 0, 3, 0, 0]);
  });

  it("should give the right matrix for transform", function () {
    expect(Transform.transform(1, 2, 3, 4, 5, 6))
      .to.deep.equal([1, 2, 3, 4, 5, 6]);
  });

  it("should multiply matrices correctly", function () {
    var m1 = [1, 2, 3, 4, 5, 6];
    var m2 = [1, 2, 4, 8, 16, 32];
    var expected = [7, 10, 28, 40, 117, 166];
    expect(Transform.multiply(m1, m2)).to.deep.equal(expected);
  });

  describe("process", function () {
    var m;

    beforeEach(function () {
      m = [1, 2, 3, 4, 5, 6];
    });

    it("should handle resetTransform properly", function () {
      expect(Transform.process(m, "resetTransform"))
        .to.deep.equal([1, 0, 0, 1, 0, 0]);
    });

    it("should handle setTransform properly", function () {
      expect(Transform.process(m, "setTransform", [7, 8, 9, 10, 11, 12]))
        .to.deep.equal([7, 8, 9, 10, 11, 12]);
    });

    it("should handle translate properly", function () {
      var expected = Transform.multiply(m, Transform.translate(4, 8));
      expect(Transform.process(m, "translate", [4, 8])).to.deep.equal(expected);
    });

    it("should handle rotate properly", function () {
      var expected = Transform.multiply(m, Transform.rotate(10));
      expect(Transform.process(m, "rotate", [10])).to.deep.equal(expected);
    });

    it("should handle scale properly", function () {
      var expected = Transform.multiply(m, Transform.scale(3, 2));
      expect(Transform.process(m, "scale", [3, 2])).to.deep.equal(expected);
    });

    it("should handle transform properly", function () {
      var expected = Transform.multiply(
        m, Transform.transform(7, 8, 9, 10, 11, 12)
      );
      expect(Transform.process(m, "transform", [7, 8, 9, 10, 11, 12]))
        .to.deep.equal(expected);
    });
  });
});
