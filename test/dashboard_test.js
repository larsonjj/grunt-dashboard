'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.dashboard = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  defaultOptions: function (test) {
    test.expect(1);

    var actual = grunt.file.read('dashboard/generated/dashboard_default.html');
    test.ok(actual, 'HTML files should exist');

    test.done();
  },
  customOptions: function (test) {
    test.expect(1);

    var actual = grunt.file.read('dashboard/generated/dashboard_custom.html');
    test.ok(actual, 'HTML files should exist');

    test.done();
  },
  jadeOptions: function (test) {
    test.expect(1);

    var actual = grunt.file.read('dashboard/generated/dashboard_jade.html');
    test.ok(actual, 'HTML files should exist');

    test.done();
  },
  jadeModule: function (test) {
    test.expect(1);

    var actual = grunt.file.read('dashboard/generated/jade-module.html');
    test.ok(actual, 'HTML files should exist');

    test.done();
  },
  swigOptions: function (test) {
    test.expect(1);

    var actual = grunt.file.read('dashboard/generated/dashboard_swig.html');
    test.ok(actual, 'HTML files should exist');

    test.done();
  },
  swigModule: function (test) {
    test.expect(1);

    var actual = grunt.file.read('dashboard/generated/swig-module.html');
    test.ok(actual, 'HTML files should exist');

    test.done();
  }
};
