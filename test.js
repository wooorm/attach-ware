'use strict';

/* eslint-env node, mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var Ware = require('ware');
var AttachWare = require('./')(Ware);

/**
 * No-op.
 */
function noop() {}

/*
 * Methods.
 */

var equal = assert.strictEqual;
var deepEqual = assert.deepEqual;

/*
 * Tests.
 */

describe('AttachWare()', function () {
    describe('use(attacher)', function () {
        it('should accept an attacher', function () {
            var ware = new AttachWare().use(noop);

            equal(ware.attachers.length, 1);
            equal(ware.fns.length, 0);
        });

        it('should accept multiple attachers', function () {
            var ware = new AttachWare().use([noop, noop]);

            equal(ware.attachers.length, 2);
            equal(ware.fns.length, 0);
        });

        it('should accept empty attach-ware', function () {
            var ware = new AttachWare().use(new AttachWare());

            equal(ware.attachers, undefined);
            equal(ware.fns.length, 0);
        });

        it('should accept attach-ware', function () {
            var ware = new AttachWare().use(
                new AttachWare().use([noop, noop])
            );

            equal(ware.attachers.length, 2);
            equal(ware.fns.length, 0);
        });

        it('should accept empty normal ware', function () {
            var ware = new AttachWare().use(new Ware());

            equal(ware.attachers, undefined);
            equal(ware.fns.length, 0);
        });

        it('should accept normal ware', function () {
            var ware = new AttachWare().use(new Ware().use([noop, noop]));

            equal(ware.attachers, undefined);
            equal(ware.fns.length, 2);
        });

        it('should attach multiple attachers in correct order', function () {
            var order = [];

            new AttachWare().use([function () {
                order.push(1);
            }, function () {
                order.push(2);
            }]);

            deepEqual(order, [1, 2]);
        });

        it('should attach a by `attach` returned middleware', function () {
            var ware = new AttachWare();

            ware.use(function () {
                return noop;
            });

            equal(ware.attachers.length, 1);
            equal(ware.fns.length, 1);
        });

        it('should invoke with the current context', function () {
            var ware = new AttachWare();
            var invoked;

            ware.use(function (context) {
                equal(context, ware);

                invoked = true;
            });

            equal(invoked, true);
        });

        it('should invoke with a `context` when present', function () {
            var ware = new AttachWare();
            var invoked;

            ware.context = {};

            ware.use(function (context) {
                equal(context, ware.context);

                invoked = true;
            });

            equal(invoked, true);
        });

        it('should pass rest-arguments', function () {
            var ware = new AttachWare();
            var invoked;

            ware.use(function (zero, one, two, three) {
                equal(zero, ware);
                equal(one, 1);
                equal(two, 2);
                equal(three, 3);

                invoked = true;
            }, 1, 2, 3);

            equal(invoked, true);
        });
    });
});
