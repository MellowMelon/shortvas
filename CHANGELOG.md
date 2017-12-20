# 0.3.1

If `getContext("2d")` returns a falsy value, Shortvas.get throws a helpful
error.

# 0.3.0

Added `noCache` option to Shortvas.get.

Shortvas now polyfills `resetTransform` based on `setTransform`.

# 0.2.1

Restored `strokeAnd`, `fillAnd`, and `clipAnd` as aliases.

# 0.2.0

`s` and `r` aliases for save/restore changed to `sv` and `rs`.

Path methods and general context methods are no longer separated. `extendPath`,
`strokeAnd`, `fillAnd`, and `clipAnd` were removed.

# 0.1.0

First release.
