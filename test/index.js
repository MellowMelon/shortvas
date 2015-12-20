/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;

var Shortvas = require("../index.js");
var ShortvasContext = require("../lib/context.js");
var Utils = require("../lib/utils.js");
var BaseFormat = require("../lib/base_format.js");

describe("Shortvas", function () {
  // Reset prototypes that may have been modified during tests. Admittedly a
  // brittle approach.
  beforeEach(function () {
    var sCtxProto = ShortvasContext.prototype;
    delete sCtxProto.newMethod;
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

  it("should implement a noCache option for get", function () {
    var backingCtx = BaseFormat.getStub();

    var shortCtx1 = Shortvas.get(backingCtx);
    var shortCtx2 = Shortvas.get(backingCtx, {noCache: true});
    var shortCtx3 = Shortvas.get(backingCtx);
    expect(shortCtx2).to.not.equal(shortCtx1);
    expect(shortCtx2).to.equal(shortCtx3);
  });

  it("should implement color", function () {
    expect(Shortvas.color).to.be.a("function");
    expect(Shortvas.color).to.equal(Utils.convertColor);
  });

  it("should implement extend", function () {
    Shortvas.extend({
      newMethod: function () {},
    });

    var backingCtx = BaseFormat.getStub();
    var shortCtx = Shortvas.get(backingCtx);
    expect(shortCtx.newMethod).to.exist;
  });
});
