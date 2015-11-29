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

  it("should wrap block in save and restore", function () {
    shortCtx.block(function () {
      shortCtx.strokeStyle = "#FF0000";
    });
  });
});
