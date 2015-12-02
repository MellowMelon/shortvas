NOTE: WIP, not yet published on NPM.

# shortvas

A wrapper around a 2D canvas context providing some shorter method names,
altered interfaces, and chaining in an attempt to make it easier to do common
canvas tasks with less typing. Compatibility with the original canvas
properties and methods is preserved to make introducing the module easier.

The only real extra feature provided over a standard context is an
implementation of `getTransform`.

# Install

With [npm](http://npmjs.org) installed, run

```
npm install shortvas
```

# Example

In the examples below, two canvases `canvas1` and `canvas2` are made. `canvas1`
is operated on using the standard context interface and `canvas2` is operated on
with an equivalent sequence of Shortvas calls.

If run in a browser:

``` js
var Shortvas = require("shortvas");

var canvas1 = document.createElement("canvas");
var longhand = canvas1.getContext("2d");

var canvas2 = document.createElement("canvas");
var shorthand = Shortvas.get(canvas2); // A context can also be passed in.

// Draw a red diagonal line.

longhand.strokeStyle = "#FF0000";
longhand.beginPath();
longhand.moveTo(5, 5);
longhand.lineTo(10, 10);
longhand.stroke();

shorthand.bp().M(5, 5).l(5, 5).stroke(0xFF0000);

// Draw a blue diamond with a green border using a 0 to 1 coordinate system.

longhand.save();
longhand.translate(40, 20);
longhand.scale(40, 40);
longhand.strokeStyle = "#00FF00";
longhand.lineWidth = 3;
longhand.fillStyle = "#0000FF";
longhand.beginPath();
longhand.moveTo(0.5, 0);
longhand.lineTo(0, 0.5);
longhand.lineTo(0.5, 1);
longhand.lineTo(1, 0.5);
longhand.closePath();
longhand.fill();
longhand.stroke();
longhand.restore();

shorthand.s()
  .toRect([40, 20, 40, 40]).bp()
  .M(0.5, 0).L(0, 0.5).L(0.5, 1).L(1, 0.5).Z()
  .fillAnd(0x0000FF).stroke(0x00FF00, 3)
.r();
```

# API

## Top-level

``` js
var Shortvas = require("shortvas");
```

### `Shortvas.get(canvas|context) -> ShortvasContext`

Returns a `ShortvasContext` instance, a wrapper around either the given context
or around the 2D context of the given canvas element.

### `Shortvas.color(color) -> String`

If the provided color is a string, return it. If it is a hexadecimal number
in `0xRRGGBB` format, return an HTML string representing that color. Behavior
for other types is undefined.

``` js
var color = Shortvas.color(0x001AB2); // "#001ab2"
```

All colors that can be passed into the various Shortvas methods pass through
this function, so you probably don't need to use it directly.

### `Shortvas.extend(methods)`

Extends the prototype of `ShortvasContext` with all methods on the provided
object which are own and enumerable. Nonfunction values will be ignored.

### `Shortvas.extendPath(methods)`

Extends the prototype of `ShortvasPath` with all methods on the provided
object which are own and enumerable. Nonfunction values will be ignored.

## `ShortvasContext`

``` js
var Shortvas = require("shortvas");
var canvas = document.createElement("canvas");
var shortCtx = Shortvas.get(canvas); // ShortvasContext instance
```

A `ShortvasContext` is returned from the module's top level `get` method and is
a wrapper around a 2D canvas context. This wrapper supports all of the
properties and methods that a typical context implementation would so that it
can be easily dropped in to existing code.

A `ShortvasContext` instance stores itself under the custom property
`__shortvas__` in the canvas element, which will be retrieved if a second
Shortvas is made with the same canvas or its 2D context. Besides making it a
lot harder to break `getTransform`, it's also more consistent with how a
canvas's `getContext` works.

### Inherited Canvas Properties and Methods

As mentioned above, `ShortvasContext` implements all of the usual properties
and methods of a 2D canvas context. Properties are implemented via ES5 getters
and setters, so setting a Shortvas property will set it on the backing canvas
context.

These are the standard canvas properties and methods supported by a
returned Shortvas instance, conditioned on the environment supporting all of
them. The list is based off information from
the [living standard](https://html.spec.whatwg.org/multipage/scripting.html#canvasrenderingcontext2d),
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D),
and what was implemented in Chrome 46.0.2490.80.
- Properties: `canvas`, `globalAlpha`, `globalCompositeOperation`, `strokeStyle`, `fillStyle`, `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`, `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `lineDashOffset`, `font`, `textAlign`, `textBaseline`
- Methods: `save`, `restore`, `scale`, `rotate`, `translate`, `transform`, `setTransform`, `resetTransform`, `createLinearGradient`, `createRadialGradient`, `createPattern`, `clearRect`, `fillRect`, `strokeRect`, `beginPath`, `fill`, `stroke`, `drawFocusIfNeeded`, `clip`, `isPointInPath`, `isPointInStroke`, `fillText`, `strokeText`, `measureText`, `drawImage`, `createImageData`, `getImageData`, `putImageData`, `getContextAttributes`, `setLineDash`, `getLineDash`, `closePath`, `moveTo`, `lineTo`, `quadraticCurveTo`, `bezierCurveTo`, `arcTo`, `rect`, `arc`

The following aliases of existing canvas properties and methods exist on
`ShortvasContext`:
- `save`: `push`, `s`
- `restore`: `pop`, `r`
- `transform`: `addT`
- `setTransform`: `setT`
- `resetTransform`: `resetT`
- `beginPath`: `bp`

### `ShortvasContext#context -> Context`

The underlying canvas context, which may be useful if you need to use features
not implemented/proxied by Shortvas. Using it in place of the `ShortvasContext`
should normally Just Work, but beware of doing transforms through the context
directly if you intend to use `getTransform`.

### `ShortvasContext#width -> Number`

Equivalent to `context.canvas.width` on the underlying context, and can be
assigned to like other proxied properties.

### `ShortvasContext#height -> Number`

Equivalent to `context.canvas.height` on the underlying context, and can be
assigned to like other proxied properties.

### `ShortvasContext#getTransform() -> Array`

_Aliases: `getT`_

Returns an array `[a, b, c, d, e, f]` representing the current transformation
matrix with the same format as the arguments one would pass to
`Context#transform`. The implied 3 by 3 transformation matrix is
```
a c e
b d f
0 0 1
```

### `ShortvasContext#rotateAbout(angle, x, y) -> ShortvasContext`

_Aliases: `pivot`_

A composite transformation equivalent to `translate(x, y)`, `rotate(angle)`,
and `translate(-x, -y)`, which has the effect of rotating everything by `angle`
radians about the point `(x, y)`.

### `ShortvasContext#rotateDeg(angle) -> ShortvasContext`

A composite transformation that multiples the passed angle by pi / 180, then
passes it to `rotate`.

### `ShortvasContext#rotateAboutDeg(angle, x, y) -> ShortvasContext`

_Aliases: `pivotDeg`_

A composite transformation that multiples the passed angle by pi / 180, then
passes it and the other arguments to `rotateAbout`.

### `ShortvasContext#toRect(from[, to = [0, 0, 1, 1]]) -> ShortvasContext`

A composite transformation of translations and scaling. Pass in two rectangles
in `[x, y, w, h]` format. The rectangle corresponding to `from` in the old
coordinate system will become the rectangle corresponding to `to` in the new
coordinate system.

For example, if you wanted your context to have the top left corner be (0, 0)
and the bottom right corner be (1, 1) and your instance is named `shortCtx`,

``` js
shortCtx.resetT().toRect(0, 0, shortCtx.width, shortCtx.height);
```

### `ShortvasContext#set(props) -> ShortvasContext`

Sets the provided properties on the context. `shortCtx.set(props)` and
`Object.assign(shortCtx, props)` are essentially equivalent.

### `ShortvasContext#with(props) -> ShortvasContext`

Same as `ShortvasContext#set` except that `save` is called just before, meaning
`with` should be balanced with a call to `restore`.

### `ShortvasContext#block([props, ]f) -> ShortvasContext`

This calls `save`, runs the function `f`, and then calls `restore`. If `props`
is provided, it will set those properties between `save` and `f`, in a manner
similar to `ShortvasContext#with`.

### `ShortvasContext#blank(color) -> ShortvasContext`

Wipes the entire canvas by temporarily resetting the transform and filling
the rectangle spanning the whole canvas with the given color. `color` can be
any value accepted by `Shortvas.color`.

### `ShortvasContext#clear() -> ShortvasContext`

Clears the entire canvas by temporarily resetting the transform and calling
`clearRect` on the whole canvas area. This turns the canvas transparent, unlike
`blank`.

### `ShortvasContext#beginPath() -> ShortvasPath`

_Aliases: `bp`_

Calls `Context#beginPath` and returns a `ShortvasPath` instance.

## `ShortvasPath`

``` js
var Shortvas = require("shortvas");
var canvas = document.createElement("canvas");
var shortCtx = Shortvas.get(canvas);
var path = shortCtx.bp(); // ShortvasPath instance
```

A `ShortvasPath` instance exposes a number of convenient methods for building
paths. Many of the vertex method names are inspired by the
[notation for the SVG d attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).
The instances also contain convenient methods for finishing paths with strokes,
fills, or both.

Note that the full capabilities of the SVG d attribute are not in the current
version. For example, `T`, `S`, and `A` are missing.

Unlike `ShortvasContext`, `ShortvasPath` does not expose all the usual canvas context
methods and properties, so make sure you understand when `ShortvasContext`
methods are being called and when `ShortvasPath` methods are called. In a
method chain, you pass from context to path with the `beginPath` (or `bp`)
context method, and you pass from path to context with the path methods
`stroke`, `fill`, or `clip`.

All vertex methods will automatically flatten one level of array nesting in
their passed arguments. This means that the following lines are equivalent:
``` js
path.Q(1, 2, 3, 4);
path.Q([1, 2], [3, 4]);
path.Q([1, 2, 3, 4]);
path.Q([1, 2], 3, 4);
path.Q(1, [2, 3], 4);
```

Since it is not in all browsers yet, `Path2D` support is not provided.

### `ShortvasPath#moveTo(x, y) -> ShortvasPath`

_Aliases: `M`_

Equivalent of `Context#moveTo`.

### `ShortvasPath#m(dx, dy) -> ShortvasPath`

Relative version of `Context#moveTo`, moving to `x + dx, y + dy` where `x, y` are
the coordinates of the last path vertex (default 0, 0).

### `ShortvasPath#lineTo(x, y) -> ShortvasPath`

_Aliases: `L`_

Equivalent of `Context#lineTo`.

### `ShortvasPath#l(dx, dy) -> ShortvasPath`

Relative version of `Context#lineTo`, drawing a line to `x + dx, y + dy` where
`x, y` are the coordinates of the last path vertex (default 0, 0).

### `ShortvasPath#H(x) -> ShortvasPath`

Same as `ShortvasPath#lineTo`, except that the `y`-coordinate is set to the
value it had for the last vertex, meaning this command draws a horizontal line.

### `ShortvasPath#h(dx) -> ShortvasPath`

Relative version of `ShortvasPath#H`, drawing a line to `x + dx, y` where
`x, y` are the coordinates of the last path vertex (default 0, 0).

### `ShortvasPath#V(y) -> ShortvasPath`

Same as `ShortvasPath#lineTo`, except that the `x`-coordinate is set to the
value it had for the last vertex, meaning this command draws a vertical line.

### `ShortvasPath#v(dy) -> ShortvasPath`

Relative version of `ShortvasPath#V`, drawing a line to `x, y + dy` where
`x, y` are the coordinates of the last path vertex (default 0, 0).

### `ShortvasPath#quadraticCurveTo(cpx, cpy, x, y) -> ShortvasPath`

_Aliases: `Q`_

Equivalent of `Context#quadraticCurveTo`.

### `ShortvasPath#q(dcpx, dcpy, dx, dy) -> ShortvasPath`

Relative version of `ShortvasPath#quadraticCurveto`, drawing a quadratic curve
to `x + dcpx, y + dcpy, x + dx, y + dy` where `x, y` are the coordinates of the
last path vertex (default 0, 0).

### `ShortvasPath#bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) -> ShortvasPath`

_Aliases: `C`_

Equivalent of `Context#bezierCurveTo`.

Unlike SVG, Shortvas does not yet support more than six arguments.

### `ShortvasPath#c(dcp1x, dcp1y, dcp2x, dcp2y, dx, dy) -> ShortvasPath`

Relative version of `ShortvasPath#bezierCurveto`, drawing a bezier curve to
`x + dcp1x, y + dcp1y, x + dcp2x, y + dcp2y, x + dx, y + dy`
where `x, y` are the coordinates of the last path vertex (default 0, 0).

### `ShortvasPath#rect(x, y, width, height) -> ShortvasPath`

Equivalent of `Context#rect`.

### `ShortvasPath#arc(x, y, radius, startAngle, endAngle, anticlockwise) -> ShortvasPath`

Equivalent of `Context#arc`.

Note that SVG's `A` does not match this method. `A` is a planned but not
currently implemented method.

### `ShortvasPath#arcTo(cp1x, cp1y, cp2x, cp2y, r) -> ShortvasPath`

Equivalent of `Context#arcTo`.

Note that significant computation is needed to ensure this method plugs into
relative methods like `l` correctly, which may be a performance liability.

### `ShortvasPath#closePath() -> ShortvasPath`

_Aliases: `Z`, `z`_

Equivalent of `Context#closePath()`.

This will not adjust the current `x, y` position, instead expecting the next
method call (if any) to have absolute coordinates. This may change in the
future.

### `ShortvasPath#stroke(strokeStyle, lineWidth) -> ShortvasContext`

Finishes the current path by setting `strokeStyle` and `lineWidth` to the given
values, then calling `Context#stroke`. Missing arguments (`null` or `undefined`)
mean those context properties are left untouched.

### `ShortvasPath#fill(fillStyle, fillRule) -> ShortvasContext`

Finishes the current path by setting `fillStyle` to the given value, then
calling `Context#fill` with the provided `fillRule`. Missing arguments (`null`
or `undefined`) mean those context properties are left untouched, or in the
case of `fillRule` the default `"nonzero"` will be used.

### `ShortvasPath#clip(fillRule) -> ShortvasContext`

Finishes the current path by calling `Context#clip` with the provided
`fillRule`, which defaults to `"nonzero"`.

### `ShortvasPath#strokeAnd(strokeStyle, lineWidth) -> ShortvasPath`

Identical to `ShortvasPath#stroke` except the ShortvasPath is returned, in case
you want to do multiple operations on the path.

### `ShortvasPath#fillAnd(fillStyle, fillRule) -> ShortvasPath`

Identical to `ShortvasPath#fill` except the ShortvasPath is returned, in case
you want to do multiple operations on the path.

### `ShortvasPath#clipAnd(fillRule) -> ShortvasPath`

Identical to `ShortvasPath#clip` except the ShortvasPath is returned, in case
you want to do multiple operations on the path.

# Wishlist

Shortvas does not yet have a 1.0 release. Here are some things that will likely
be implemented by that time:
- Finish implementing missing SVG path vertex types.
- Font utilities, including string-to-object and object-to-string facilities.
- Gradient and pattern utilities.

# Test

With [npm](http://npmjs.org) installed, run

```
npm test
```

To lint with [ESLint](http://eslint.org/), run

```
npm run check
```

# License

MIT
