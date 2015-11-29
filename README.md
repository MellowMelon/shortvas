# shortvas

A wrapper around a Canvas Context providing some shorter names, altered
interfaces, and chaining in an attempt to make it easier to do common Canvas
tasks with less typing. Compatibility with the original Canvas properties and
methods is preserved to make introducing the module easier.

shortvas is not intended to implement a bunch of utility methods. The only
substantial addition shortvas provides is `getTransform`, a method for
retrieving the current transformation of the Canvas, just because the hardest
thing about implementing it is having some kind of wrapper in place.

# Example

In the examples below, two canvases `canvas1` and `canvas2` are made. `canvas1`
is operated on using the standard context interface and `canvas2` is operated on
with an equivalent sequences of Shortvas calls.

If run in a browser

``` js
var Shortvas = require("shortvas");

var canvas1 = document.createElement("canvas");
var longhand = canvas1.getContext("2d");

var canvas2 = document.createElement("canvas");
var shorthand = new Shortvas(canvas2); // A context can also be passed in.

// Draw a red diagonal line.

longhand.strokeStyle = "#FF0000";
longhand.beginPath();
longhand.moveTo(5, 5);
longhand.lineTo(10, 10);
longhand.stroke();

shorthand.bp().M(5, 5).L(10, 10).stroke(0xFF0000);

// ...
```

# API

``` js
var Shortvas = require("shortvas");
```

## Shortvas.get(canvas|context) -> ShortvasContext

Returns a `ShortvasContext` instance, a wrapper around either the given context
or around the 2D context of the given Canvas element.

## Shortvas.color(color) -> String

If the provided color is a string, return it. If it is a hexadecimal number
in `0xRRGGBB` format, return an HTML string representing that color. Behavior
for other types is undefined.

All colors that can be passed into the various Shortvas methods pass through
this function, so you probably don't need to use it directly.

## ShortvasContext

A `ShortvasContext` is returned from the module's top level `get` method and is
a wrapper around a Canvas context. This wrapper supports all of the properties
and methods that a typical context implementation would. See "Supported Canvas
Features" below for details. The API given here for the `ShortvasContext` only
lists new and changed methods.

A ShortvasContext instance stores itself under the custom property `__shortvas__` in
the Canvas element, which will be retrieved if a second Shortvas is made with
the same Canvas. Besides making it a lot harder to break `getTransform`, it's
also more consistent with how a Canvas's `getContext` works.
([The perils of this approach](http://perfectionkills.com/whats-wrong-with-extending-the-dom/)
were given due consideration. Fortunately a working Canvas gives us a baseline
for browser support.)

### ShortvasContext#context

The underlying Canvas context, if somehow you need it. Using it in place of the
`ShortvasContext` should normally Just Work, but beware of doing transforms
through the context directly if you intend to use `getTransform`.

### ShortvasContext#block(f) -> ShortvasContext

Saves the context, runs the function `f`,  andrestores the context. If you
aren't in an environment with arrow functions, this method is fairly useless
since you're throwing the `this` binding away for little benefit. Chainable.

### ShortvasContext#bp() -> ShortvasPath

Calls `beginPath` and returns a `ShortvasPath` instance.

## ShortvasPath

A `ShortvasPath` instance exposes a number of convenient methods for building
paths. Many of the vertex method names are inspired by the
[notation for the SVG d attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).
The instances also contain convenient methods for finishing paths with strokes,
fills, or both.

Note that the full capabilities of the SVG d attribute are not in the current
version. For example, `T`, `S`, and `A` are missing.

Since it is not in all browsers yet, `Path2D` support is not provided.

### ShortvasPath#moveTo(x, y) -> ShortvasPath

_Aliases: `M`_

Equivalent of `Context#moveTo`. Chainable.

### ShortvasPath#m(dx, dy) -> ShortvasPath

Relative version of `Context#moveTo`, moving to `x + dx, y + dy` where `x, y` are
the coordinates of the last path vertex (default 0, 0). Chainable.

### ShortvasPath#lineTo(x, y) -> ShortvasPath

_Aliases: `L`_

Equivalent of `Context#lineTo`. Chainable.

### ShortvasPath#l(dx, dy) -> ShortvasPath

Relative version of `Context#lineTo`, drawing a line to `x + dx, y + dy` where
`x, y` are the coordinates of the last path vertex (default 0, 0). Chainable.

### ShortvasPath#H(x) -> ShortvasPath

Same as `ShortvasPath#lineTo`, except that the `y`-coordinate is set to the
value it had for the last vertex, meaning this command draws a horizontal line.
Chainable.

### ShortvasPath#h(dx) -> ShortvasPath

Relative version of `ShortvasPath#H`, drawing a line to `x + dx, y` where
`x, y` are the coordinates of the last path vertex (default 0, 0). Chainable.

### ShortvasPath#V(y) -> ShortvasPath

Same as `ShortvasPath#lineTo`, except that the `x`-coordinate is set to the
value it had for the last vertex, meaning this command draws a vertical line.
Chainable.

### ShortvasPath#v(dy) -> ShortvasPath

Relative version of `ShortvasPath#V`, drawing a line to `x, y + dy` where
`x, y` are the coordinates of the last path vertex (default 0, 0). Chainable.

### ShortvasPath#quadraticCurveTo(cpx, cpy, x, y) -> ShortvasPath

_Aliases: `Q`_

Equivalent of `Context#quadraticCurveTo`. Chainable.

### ShortvasPath#q(dcpx, dcpy, dx, dy) -> ShortvasPath

Relative version of `ShortvasPath#quadraticCurveto`, drawing a quadratic curve
to `x + dcpx, y + dcpy, x + dx, y + dy` where `x, y` are the coordinates of the
last path vertex (default 0, 0). Chainable.

### ShortvasPath#bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) -> ShortvasPath

_Aliases: `C`_

Equivalent of `Context#bezierCurveTo`. Chainable.

Unlike SVG, Shortvas does not yet support more than six arguments.

### ShortvasPath#c(dcp1x, dcp1y, dcp2x, dcp2y, dx, dy) -> ShortvasPath

Relative version of `ShortvasPath#bezierCurveto`, drawing a bezier curve to `x
+ dcp1x, y + dcp1y, x + dcp2x, y + dcp2y, x + dx, y + dy` where `x, y` are the
coordinates of the last path vertex (default 0, 0). Chainable.

### ShortvasPath#rect(x, y, width, height) -> ShortvasPath

Equivalent of `Context#rect`. Chainable.

### ShortvasPath#arc(x, y, radius, startAngle, endAngle, anticlockwise) -> ShortvasPath

Equivalent of `Context#arc`. Chainable.

Note that SVG's `A` does not match this method. `A` is a planned but not
currently implemented method.

### ShortvasPath#arcTo(cp1x, cp1y, cp2x, cp2y, r) -> ShortvasPath

Equivalent of `Context#arcTo`. Chainable.

For the performance-concerned, note that the computations required to make this
work with relative positioning are somewhat involved.

### ShortvasPath#closePath() -> ShortvasPath

_Aliases: `Z`, `z`_

Equivalent of `Context#closePath()`. Chainable.

This will not adjust the current `x, y` position, instead expecting the next
method call (if any) to have absolute coordinates. This may change in the
future.

### ShortvasPath#stroke(strokeStyle, lineWidth) -> ShortvasContext

Finishes the current path by calling `Canvas#stroke` while the `strokeStyle`
and `lineWidth` are set to the given parameters, then resets `strokeStyle` and
`lineWidth` to their original values. Returns the original ShortvasContext.

### ShortvasPath#fill(fillStyle, fillRule) -> ShortvasContext

Finishes the current path by calling `Canvas#fill` with the `fillRule` while the
`fillStyle` is set to the given parameter, then resets `fillStyle` to its
original value. Returns the original ShortvasContext.

### ShortvasPath#strokeFill(strokeStyle, lineWidth, fillStyle, fillRule) -> ShortvasContext

Like the above, but calls `Canvas#stroke` and `Canvas#fill` in that order.
Returns the original ShortvasContext.

Usually you want its cousin `fillStroke` instead.

### ShortvasPath#fillStroke(fillStyle, fillRule, strokeStyle, lineWidth) -> ShortvasContext

Like the above, but calls `Canvas#fill` and `Canvas#stroke` in that order.
Returns the original ShortvasContext.

# Install

With [npm](http://npmjs.org) installed, run

```
npm install shortvas
```

# Test

With [npm](http://npmjs.org) installed, run

```
npm test
```

To lint with [ESLint](http://eslint.org/), run

```
npm run check
```

# Differences between Standard Contexts and Shortvas

To make it easy to bring into an existing project, Shortvas implements all of
the usual properties and methods of a Canvas context. Properties are implemented
via ES5 getters and setters, so setting a Shortvas property will set it on the
backing Canvas context.

These are the standard Canvas properties and methods supported by a
returned Shortvas instance, conditioned on the environment supporting all of
them. The list is based off information from
the [living standard](https://html.spec.whatwg.org/multipage/scripting.html#canvasrenderingcontext2d),
[MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D),
and what was implemented in Chrome 46.0.2490.80.
- Properties: `canvas, globalAlpha, globalCompositeOperation, strokeStyle, fillStyle, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset, font, textAlign, textBaseline`
- Methods: `save, restore, scale, rotate, translate, transform, setTransform, resetTransform, createLinearGradient, createRadialGradient, createPattern, clearRect, fillRect, strokeRect, beginPath, fill, stroke, drawFocusIfNeeded, clip, isPointInPath, isPointInStroke, fillText, strokeText, measureText, drawImage, createImageData, getImageData, putImageData, getContextAttributes, setLineDash, getLineDash, closePath, moveTo, lineTo, quadraticCurveTo, bezierCurveTo, arcTo, rect, arc`

# License

MIT
