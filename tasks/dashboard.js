/*
 * grunt-dashboard
 * https://github.com/larsonjj/grunt-dashboard
 *
 * Copyright (c) 2014 Jake Larson
 * Licensed under the MIT license.
 */

'use strict';

var handlebars = require('handlebars');
var path = require('path');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('dashboard', 'Generates a static dashboard based on data parsed within specified files', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      // Allows author to use custom compiler
      // NOTE: needs to have a compile() method or it won't work
      compiler: require('jade'),
      compilerOptions: {pretty: true, filename: true},
      generatedDir: 'dashboard/generated',
      // searchTerm: 'dash',
      dashTemplate: 'node_modules/grunt-dashboard/dashboard/dashboard-template.hbs',
      moduleTemplate: 'node_modules/grunt-dashboard/dashboard/module-template.hbs',
      // logo: '',
      data: {},
      includes: [{
        cwd: 'node_modules/grunt-dashboard/dashboard/assets/',
        src: [
          '**/*'
        ]
      }]
    });

    var handlebarsOptions = {};

    var compileToFile = function(item) {

      grunt.log.debug(item.source);

      try {
        item.source = options.compiler.render(item.source, options.compilerOptions);
      }
      catch (e) {
        grunt.log.error('Data inside "' + item.name + '" will not compile');
        grunt.log.error('------- Details Below -------');
        grunt.log.errorlns(e);
      }

      // Grab handlebars template for modules
      var templateFile = grunt.file.read(options.moduleTemplate);

      // Compile out HTML from template
      var template = handlebars.compile(templateFile);

      //Pass data to template
      var html = template(item);

      grunt.file.write('./' + options.generatedDir + '/' + item.name + '.html', html);
      grunt.log.writeln('HTML file created at:  "' + options.generatedDir + '/' + item.name + '.html"');
    };

    var getExtension = function(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    };

    // Iterate over all specified file groups (ie: output destination(s)).
    this.files.forEach(function (file) {
      // Concat specified files.
      var output = file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        var src = grunt.file.read(filepath);
        var fileExt = getExtension(filepath);

        var data = {};

        if (fileExt === '.json') {
          // Test to make sure data is JSON compatible
          try {
            data = JSON.parse(src);
          }
          catch (e) {
            grunt.log.error('Data inside "' + file.src + '" is not in correct JSON format');
            grunt.log.error('------- Details Below -------');
            grunt.log.errorlns(e);
          }

          // Set a default label if none is found
          if (!data.label) {
            data.label = path.basename(filepath, '.html');
          }

          // Set a default link if none is found
          if (!data.link) {
            data.link = '/' + filepath;
          }

          // Set a default status if none is found
          if (!data.status) {
            data.status = 'unknown';
          }

          // Set a default category if none is found
          if (!data.category) {
            data.category = 'unknown';
          }

          return {
            source: JSON.stringify(data),
            type: 'json'
          };
        }
        else {
          return {
            source: src,
            type: 'non-json',
            name: path.basename(filepath, '.dash' + fileExt)
          };
        }

      });

      if (output.length < 1) {
        grunt.log.warn('Destination not written because file were empty.');
      }
      else {
        var jsonArray = [];

        output.forEach(function(item) {

          // console.log(item);

          if (item.type === 'json') {
            jsonArray.push(item.source);
          }
          else {
            // Grab all non-JSON sources within files and compile it to HTML file
            compileToFile(item);
          }

        });


        if (jsonArray.length > 0) {

          // Create generated data object
          handlebarsOptions.generated = JSON.parse('[' + jsonArray.join(',') + ']');

          // Grab all categories
          var categories = _.pluck(handlebarsOptions.generated, 'category');
          categories = _.uniq(categories);
          categories = categories.map(function(val) {
            return {
              class: val,
              name: _.titleize(val)
            };
          });

          // Grab all categories
          var statuses = _.pluck(handlebarsOptions.generated, 'status');
          statuses = _.uniq(statuses);
          statuses = statuses.map(function(val) {
            return {
              class: val,
              name: _.titleize(val)
            };
          });

          // Set categories data
          handlebarsOptions.categories = categories;

          // Set statuses data
          handlebarsOptions.statuses = statuses;

          // Set logo
          handlebarsOptions.logo = options.logo;

          // Set custom data
          handlebarsOptions.data = options.data;

          // Create if value helper for Handlebars templates
          handlebars.registerHelper('ifvalue', function (conditional, config) {
            if (config.hash.value === conditional) {
              return config.fn(this);
            }
            else {
              return config.inverse(this);
            }
          });

          // Read the dashboard handlebars template
          var templateFile = grunt.file.read(options.dashTemplate);

          // Compile template source
          var template = handlebars.compile(templateFile);

          // Create HTML from template, data, and config
          var html = template(handlebarsOptions);

          // Remove filename from file.dest path
          // ie dashboard/index.html => dashboard/
          var assetDir = file.dest.split('/');
          assetDir.pop();

          // Write the destination file.
          grunt.file.write(file.dest, html);

          var includes;

          // Grab all files from `options.includes` array
          options.includes.forEach(function(item) {
            includes = grunt.file.expand({cwd: item.cwd}, item.src);

            // Copy each file to the same directory where the dashboard will be generated
            includes.forEach(function(filePath) {
              if (grunt.file.isFile(item.cwd + filePath)) {
                grunt.file.copy(item.cwd + filePath, assetDir.join('/') + '/' + filePath);
                grunt.log.debug('%s created at: %s', filePath, assetDir.join('/') + '/' + filePath);
              }
              else if (grunt.file.isDir(item.cwd + filePath)) {
                return;
              }
            });
          });

          // console.log(includes);

          // Print a success message.
          grunt.log.writeln('Dashboard created at:  "' + file.dest + '"');
        }
        else {
          grunt.log.writeln('No data Found in: "' + file.dest + '"');
        }
      }
    });
  });
};
