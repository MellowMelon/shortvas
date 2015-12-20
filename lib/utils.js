var padLeft = exports.padLeft = function (str, minLength, padStr) {
  while (str.length < minLength) {
    str = (padStr + str).slice(-minLength);
  }
  return str;
};

// Converts a color to a string acceptable by a Canvas, even if provided in
// hexadecimal 0xRRGGBB format.
exports.convertColor = function (color) {
  return typeof color === "number" ?
    "#" + padLeft(color.toString(16), 6, "0") :
    color;
};

// Remove one level of nesting in an array or array-like and return the result.
// If an array-like with no nesting is passed, an array-like will be returned.
exports.flatten = function (arr) {
  // We'll try to get away with doing nothing if there are no nested arrays.
  var result = null;
  var j;
  for (var i = 0; i < arr.length; i += 1) {
    if (arr[i] && typeof arr[i] === "object" && arr[i].length) {
      result = result || Array.prototype.slice.call(arr, 0, i);
      for (j = 0; j < arr[i].length; j += 1) {
        result.push(arr[i][j]);
      }
    } else if (result) {
      result.push(arr[i]);
    }
  }
  return result || arr;
};
