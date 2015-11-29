var padLeft = function (str, minLength, padStr) {
  while (str.length < minLength) {
    str = (padStr + str).slice(-minLength);
  }
  return str;
}

// Converts a color to a string acceptable by a Canvas, even if provided in
// hexadecimal 0xRRGGBB format.
exports.convertColor = function (color) {
  return typeof color === "number" ?
    "#" + padLeft(color.toString(16), 6, "0") :
    color;
};
