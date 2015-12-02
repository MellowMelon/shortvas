/* eslint-env node, mocha */
/* eslint-disable no-unused-expressions */

var expect = require("chai").expect;

var Utils = require("../lib/utils.js");

describe("utils", function () {
  // The only usage of padLeft currently is for convertColor, so we focus on
  // that particular usage pattern.
  describe("padLeft", function () {
    it("should pad strings not yet long enough", function () {
      expect(Utils.padLeft("123", 6, "0")).to.equal("000123");
    });

    it("should not change strings already long enough", function () {
      expect(Utils.padLeft("abcdef", 6, "0")).to.equal("abcdef");
    });
  });

  describe("convertColor", function () {
    it("should leave string arguments unchanged", function () {
      expect(Utils.convertColor("abc")).to.equal("abc");
    });

    it("should change 0xRRGGBB numbers to the HTML color string", function () {
      expect(Utils.convertColor(0xABCDEF)).to.equal("#abcdef");
    });

    it("should output color codes with the right length", function () {
      expect(Utils.convertColor(0x000001)).to.equal("#000001");
    });
  });

  describe("flatten", function () {
    it("should flatten nested arrays", function () {
      expect(Utils.flatten([[1, 2], 3])).to.deep.equal([1, 2, 3]);
    });

    it("should flatten array-like objects", function () {
      expect(Utils.flatten({
        0: {0: 1, 1: 2, length: 2},
        1: 3,
        length: 2,
      })).to.deep.equal([1, 2, 3]);
    });

    it("should leave arrays with no nesting untouched", function () {
      expect(Utils.flatten([1, 2, 3])).to.deep.equal([1, 2, 3]);
    });
  });
});
