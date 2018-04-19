'use strict'

var test = require('tape')
var Ware = require('ware')
var AttachWare = require('.')(Ware)

var noop = Function.prototype

test('AttachWare()', function(t) {
  t.test('should accept an attacher', function(st) {
    var ware = new AttachWare().use(noop)

    st.equal(ware.attachers.length, 1)
    st.equal(ware.fns.length, 0)

    st.end()
  })

  t.test('should accept a `list`', function(st) {
    var ware = new AttachWare()

    st.plan(3)

    ware.use([
      function(context, $0, $1) {
        st.equal(context, ware)
        st.equal($0, 0)
        st.equal($1, 1)
      },
      0,
      1
    ])
  })

  t.test('should accept a `list` without input', function(st) {
    var ware = new AttachWare()

    st.plan(2)

    ware.use([
      function(context, $0) {
        st.equal(context, ware)
        st.equal($0, undefined)
      }
    ])
  })

  t.test('should accept a `matrix`', function(st) {
    var ware = new AttachWare()

    st.plan(3)

    ware.use([
      [
        function(context, $0, $1) {
          st.equal(context, ware)
          st.equal($0, 0)
          st.equal($1, 1)
        },
        0,
        1
      ]
    ])
  })

  t.test('should accept a `matrix` without input', function(st) {
    var ware = new AttachWare()

    st.plan(2)

    ware.use([
      [
        function(context, $0) {
          st.equal(context, ware)
          st.equal($0, undefined)
        }
      ]
    ])
  })

  t.test('should accept `attachers`', function(st) {
    var ware = new AttachWare()

    st.plan(3)

    ware.use(
      [
        function(context, $0, $1) {
          st.equal(context, ware)
          st.equal($0, 0)
          st.equal($1, 1)
        }
      ],
      0,
      1
    )
  })

  t.test('should accept multiple attachers', function(st) {
    var ware = new AttachWare().use([noop, noop])

    st.equal(ware.attachers.length, 2)
    st.equal(ware.fns.length, 0)

    st.end()
  })

  t.test('should attach multiple attachers in correct order', function(st) {
    var order = []

    new AttachWare().use([
      function() {
        order.push(1)
      },
      function() {
        order.push(2)
      }
    ])

    st.deepEqual(order, [1, 2])

    st.end()
  })

  t.test('should accept multiple attachers in a matrix', function(st) {
    var ware = new AttachWare()
    var order = []

    st.plan(7)

    ware.use([
      [
        function(context, $1, $2) {
          st.equal(context, ware)
          st.equal($1, 1)
          st.equal($2, 2)

          order.push(1)
        },
        1,
        2
      ],
      [
        function(context, $1, $2) {
          st.equal(context, ware)
          st.equal($1, 3)
          st.equal($2, 4)

          order.push(2)
        },
        3,
        4
      ]
    ])

    st.deepEqual(order, [1, 2])
  })

  t.test('should attach a by `attach` returned middleware', function(st) {
    var ware = new AttachWare()

    ware.use(function() {
      return noop
    })

    st.equal(ware.attachers.length, 1)
    st.equal(ware.fns.length, 1)

    st.end()
  })

  t.test('should invoke with the current context', function(st) {
    var ware = new AttachWare()

    st.plan(1)

    ware.use(function(context) {
      st.equal(context, ware)
    })
  })

  t.test('should invoke with a `context` when present', function(st) {
    var ware = new AttachWare()

    st.plan(1)

    ware.context = {}

    ware.use(function(context) {
      st.equal(context, ware.context)
    })
  })

  t.test('should pass rest-arguments', function(st) {
    var ware = new AttachWare()

    st.plan(4)

    ware.use(
      function(zero, one, two, three) {
        st.equal(zero, ware)
        st.equal(one, 1)
        st.equal(two, 2)
        st.equal(three, 3)
      },
      1,
      2,
      3
    )
  })
})
