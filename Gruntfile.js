/*
 * grunt-dashboard
 * https://github.com/larsonjj/grunt-dashboard
 *
 * Copyright (c) 2014 Jake Larson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    dashboard: {
      default_options: {
        options: {
          dashTemplate: 'dashboard/dashboard-template.hbs'
        },
        files: {
          'tmp/dashboard_default.html': ['test/fixtures/default/*.html']
        }
      },
      custom_options: {
        options: {
          searchTerm: 'custom',
          dashTemplate: 'dashboard/dashboard-template.hbs'
        },
        files: {
          'tmp/dashboard_custom.html': ['test/fixtures/custom/*.html']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'dashboard', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
