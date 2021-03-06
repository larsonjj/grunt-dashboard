/*
 * grunt-dashboard
 * https://github.com/larsonjj/grunt-dashboard
 *
 * Copyright (c) 2014 Jake Larson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    eslint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        configFile: '.eslintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    dashboard: {
      defaultOptions: {
        options: {
          dashTemplate: 'dashboard/dashboard-template.hbs',
          moduleTemplate: 'dashboard/module-template.hbs',
          includes: [{
            cwd: 'dashboard/assets/',
            src: [
              '**/*'
            ]
          }]
        },
        files: {
          'dashboard/generated/dashboard_default.html': ['test/fixtures/default/*.dash.json']
        }
      },
      customOptions: {
        options: {
          searchTerm: 'custom',
          dashTemplate: 'dashboard/dashboard-template.hbs',
          moduleTemplate: 'dashboard/module-template.hbs',
          includes: [{
            cwd: 'dashboard/assets/',
            src: [
              '**/*'
            ]
          }]
        },
        files: {
          'dashboard/generated/dashboard_custom.html': ['test/fixtures/custom/*.dash.json']
        }
      },
      jade: {
        options: {
          compiler: require('jade'),
          compilerOptions: {pretty: true, filename: true},
          dashTemplate: 'dashboard/dashboard-template.hbs',
          moduleTemplate: 'dashboard/module-template.hbs',
          includes: [{
            cwd: 'dashboard/assets/',
            src: [
              '**/*'
            ]
          }]
        },
        files: {
          'dashboard/generated/dashboard_jade.html': ['test/fixtures/jade/**/*.dash.{jade,json}']
        }
      },
      swig: {
        options: {
          compiler: require('swig'),
          compilerOptions: {filename: true},
          dashTemplate: 'dashboard/dashboard-template.hbs',
          moduleTemplate: 'dashboard/module-template.hbs',
          includes: [{
            cwd: 'dashboard/assets/',
            src: [
              '**/*'
            ]
          }]
        },
        files: {
          'dashboard/generated/dashboard_swig.html': ['test/fixtures/swig/**/*.dash.{swig,json}']
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
  grunt.registerTask('default', ['eslint', 'test']);

};
