/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;

var Shortvas = require("../index.js");
var Utils = require("../lib/utils.js");
var BaseFormat = require("../lib/base_format.js");

describe("Shortvas", function () {
  // Reset prototypes that may have been modified during tests. Admittedly a
  // brittle approach.
  beforeEach(function () {
    var sCtxProto = require("../lib/context.js").prototype;
    delete sCtxProto.newMethod;

    var sPathProto = require("../lib/path.js").prototype;
    delete sPathProto.newMethod;
  });

  it("should implement get", function () {
    var backingCtx = BaseFormat.getStub();
    var shortCtx = Shortvas.get(backingCtx);
    // Duck-type to verify
    expect(shortCtx.lineWidth, "has lineWidth").to.exist;
    expect(shortCtx.beginPath, "has beginPath").to.exist;
    expect(shortCtx.getTransform, "has getTransform").to.exist;
  });

  it("should implement canvas-level caching for get", function () {
    var backingCtxBase = BaseFormat.getStub();
    var backingCtxSame = BaseFormat.getStub();
    var backingCtxOther = BaseFormat.getStub();
    backingCtxSame.canvas = backingCtxBase.canvas;

    var shortCtxBase = Shortvas.get(backingCtxBase);
    var shortCtxSame = Shortvas.get(backingCtxSame);
    var shortCtxOther = Shortvas.get(backingCtxOther);
    expect(shortCtxBase).to.equal(shortCtxSame);
    expect(shortCtxBase).to.not.equal(shortCtxOther);
  });

  it("should implement extend", function () {
    Shortvas.extend({
      newMethod: function () {},
    });

    var backingCtx = BaseFormat.getStub();
    var shortCtx = Shortvas.get(backingCtx);
    expect(shortCtx.newMethod).to.exist;
    expect(shortCtx.bp().newMethod).to.not.exist;
  });

  it("should implement extendPath", function () {
    Shortvas.extendPath({
      newMethod: function () {},
    });

    var backingCtx = BaseFormat.getStub();
    var shortCtx = Shortvas.get(backingCtx);
    expect(shortCtx.newMethod).to.not.exist;
    expect(shortCtx.bp().newMethod).to.exist;
  });
});
