'use strict';

/* eslint-env node */

/*
 * Dependencies.
 */

var test = require('tape');
var Ware = require('ware');
var AttachWare = require('./')(Ware);

/**
 * No-op.
 */
function noop() {}

/*
 * Tests.
 */

test('AttachWare()', function (t) {
    t.test('should accept an attacher', function (st) {
        var ware = new AttachWare().use(noop);

        st.equal(ware.attachers.length, 1);
        st.equal(ware.fns.length, 0);

        st.end();
    });

    t.test('should accept multiple attachers', function (st) {
        var ware = new AttachWare().use([noop, noop]);

        st.equal(ware.attachers.length, 2);
        st.equal(ware.fns.length, 0);

        st.end();
    });

    t.test('should accept empty attach-ware', function (st) {
        var ware = new AttachWare().use(new AttachWare());

        st.equal(ware.attachers, undefined);
        st.equal(ware.fns.length, 0);

        st.end();
    });

    t.test('should accept attach-ware', function (st) {
        var ware = new AttachWare().use(
            new AttachWare().use([noop, noop])
        );

        st.equal(ware.attachers.length, 2);
        st.equal(ware.fns.length, 0);

        st.end();
    });

    t.test('should accept empty normal ware', function (st) {
        var ware = new AttachWare().use(new Ware());

        st.equal(ware.attachers, undefined);
        st.equal(ware.fns.length, 0);

        st.end();
    });

    t.test('should accept normal ware', function (st) {
        var ware = new AttachWare().use(new Ware().use([noop, noop]));

        st.equal(ware.attachers, undefined);
        st.equal(ware.fns.length, 2);

        st.end();
    });

    t.test('should attach multiple attachers in correct order', function (st) {
        var order = [];

        new AttachWare().use([function () {
            order.push(1);
        }, function () {
            order.push(2);
        }]);

        st.deepEqual(order, [1, 2]);

        st.end();
    });

    t.test('should attach a by `attach` returned middleware', function (st) {
        var ware = new AttachWare();

        ware.use(function () {
            return noop;
        });

        st.equal(ware.attachers.length, 1);
        st.equal(ware.fns.length, 1);

        st.end();
    });

    t.test('should invoke with the current context', function (st) {
        var ware = new AttachWare();

        st.plan(1);

        ware.use(function (context) {
            st.equal(context, ware);
        });
    });

    t.test('should invoke with a `context` when present', function (st) {
        var ware = new AttachWare();

        st.plan(1);

        ware.context = {};

        ware.use(function (context) {
            st.equal(context, ware.context);
        });
    });

    t.test('should pass rest-arguments', function (st) {
        var ware = new AttachWare();

        st.plan(4);

        ware.use(function (zero, one, two, three) {
            st.equal(zero, ware);
            st.equal(one, 1);
            st.equal(two, 2);
            st.equal(three, 3);
        }, 1, 2, 3);
    });
});
