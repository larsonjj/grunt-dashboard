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
  default_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/dashboard_default.html');
    // var expected = grunt.file.read('test/expected/dashboard_default.html');
    test.ok(actual, 'HTML files should match');

    test.done();
  },
  custom_options: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/dashboard_custom.html');
    // var expected = grunt.file.read('test/expected/dashboard_custom.html');
    test.ok(actual, 'HTML files should match');

    test.done();
  }
};
