# attach-ware

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Middleware with configuration.

## Install

[npm][]:

```sh
npm install attach-ware
```

## Use

`x.js`:

```js
module.exports = x

function x(ctx, options) {
  return options.condition ? transform : null

  function transform(req, res, next) {
    res.x = 'hello'
    next()
  }
}
```

`y.js`:

```js
module.exports = y

function y(ctx, options) {
  return options.condition ? transform : null

  function transform(req, res, next) {
    res.y = 'world'
    next()
  }
}
```

`index.js`:

```js
var ware = require('attach-ware')(require('ware'))
var x = require('./x')
var y = require('./y')

var middleware = ware()
  .use(x, {condition: true})
  .use(y, {condition: false})

middleware.run({}, {}, done)

function done(err, req, res) {
  if (err) throw err
  console.log(res.x) // => "hello"
  console.log(res.y) // => undefined
}
```

## API

### `AttachWare = attachWare(Ware)`

Create a new `AttachWare` based on the given middleware constructor.

###### Parameters

*   `Ware` ([`Ware`][ware])

###### Returns

`Function`.

### `AttachWare()`

Create configurable middleware.
Works just like the given [`Ware`][ware].

### `AttachWare#use(attacher[, input...])`

###### Signatures

*   `attachWare.use(attacher[, input...])`
*   `attachWare.use(attachers[, input...])`
*   `attachWare.use(list)`
*   `attachWare.use(matrix)`

###### Parameters

*   `attacher` (`Function`) — One attacher
*   `attachers` (`Array.<Function>`)
    — List where each value is an `attacher`
*   `list` (`Array`)
    — List where the first value is an `attacher`, and further values
    are `input`
*   `matrix` (`Array`)
    — Matrix where each entry is a `list`

Invokes `attacher` with [`context`][context] and all `input`.

If `attacher` returns another function (`fn`, which can be synchronous,
asynchronous, or a generator function), that function is [added to the
middleware][ware-use], and will be invoked when [`run()`][ware-run] is invoked
like normal middleware.

### `AttachWare#context`

The first argument for `attach`ers.
When this is falsey, the instance itself is used.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/wooorm/attach-ware.svg

[build]: https://travis-ci.org/wooorm/attach-ware

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/attach-ware.svg

[coverage]: https://codecov.io/github/wooorm/attach-ware

[downloads-badge]: https://img.shields.io/npm/dm/attach-ware.svg

[downloads]: https://www.npmjs.com/package/attach-ware

[size-badge]: https://img.shields.io/bundlephobia/minzip/attach-ware.svg

[size]: https://bundlephobia.com/result?p=attach-ware

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[ware]: https://github.com/segmentio/ware#ware-1

[ware-use]: https://github.com/segmentio/ware#usefn

[ware-run]: https://github.com/segmentio/ware#runinput-callback

[context]: #attachwarecontext
