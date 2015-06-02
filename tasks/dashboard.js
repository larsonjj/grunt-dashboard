/*
 * grunt-dashboard
 * https://github.com/larsonjj/grunt-dashboard
 *
 * Copyright (c) 2014 Jake Larson
 * Licensed under the MIT license.
 */

'use strict';

var handlebars = require('handlebars');
var jade = require('jade');
var swig = require('swig');
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
      debug: true,
      generatedDir: 'dashboard/generated',
      searchTerm: 'dash',
      dashTemplate: 'node_modules/grunt-dashboard/dashboard/dashboard-template.hbs',
      moduleTemplate: 'node_modules/grunt-dashboard/dashboard/module-template.hbs',
      logo: '',
      data: {},
      assets: [{
        cwd: 'node_modules/grunt-dashboard/dashboard/assets/',
        src: [
          '**/*'
        ]
      }]
    });

    var handlebarsOptions = {};

    // Remove whitespace and newlines
    var stripInvisibles = function(string) {
      return string.replace(/\n/g, '').replace(/\s/g, '').replace(/\t/g, '');
    };

    var toTitleCase = function(str) {
      return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    var parseLines = function(str, fileExt) {
      var lines = str.replace(/\r\n/g, '\n').split(/\n/);
      var lineArray = [];
      var contentArray = [];
      var record = false;
      var type;

      lines.some(function (line) {
        var regbuild;
        var regend = new RegExp('\\s*\\[\\s*\\/\\s*' + options.searchTerm + '\\s*\\]\\s*');
        if (fileExt === '.html') {
          // start build pattern -- <!-- [dash:html]
          regbuild = new RegExp('<!--\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*');
        }
        else if (fileExt === '.jade') {
          // start build pattern -- //[dash:jade]
          regbuild = new RegExp('\/\/-\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*');
        }
        else if (fileExt === '.swig') {
          // start build pattern -- {# [dash:swig]
          regbuild = new RegExp('{#\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*');
        }
        else {
          grunt.log.error('File type not supported: %s', fileExt);
        }

        // var indent = (line.match(/^\s*/) || [])[0];
        var build = line.match(regbuild);
        var startbuild = regbuild.test(line);
        var endbuild = regend.test(line);

        if (endbuild) {
          record = false;
          contentArray.push({
            source: lineArray.join('\n'),
            type: type
          });
          lineArray = [];
        }

        if (record) {
          if (fileExt === '.jade') {
            line = line.replace(/^(\s+|\t+)/, '');
          }
          lineArray.push(line);
        }

        if (startbuild) {
          record = true;
          if (build[1]) {
            type = build[1];
          }
          else {
            type = 'data';
          }
        }

      });

      return contentArray;
    };

    // Remove all data comments from HTML file
    var removeDataComments = function(str, filepath) {
      var regAll = new RegExp('<!--\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*[\\s\\S]*?-->', 'g');
      var containsData = regAll.test(str);
      if (containsData) {
        grunt.file.write(filepath, str.replace(regAll, ''));
      }
    };

    var compileToFile = function(item) {
      _.each(item, function(data) {

        // var files = [];
        var includes = '';

        if (data.type === 'jade') {
          grunt.log.debug(data.source);
          data.source = jade.render(includes + data.source, {pretty: true, filename: true});
        }
        else if (data.type === 'swig') {
          grunt.log.debug(data.source);
          swig.setDefaults({ cache: false }); // Disable caching of templates
          data.source = swig.render(includes + data.source, {filename: true});
        }

        // Grab handlebars template for modules
        var templateFile = grunt.file.read(options.moduleTemplate);

        // Compile out HTML from template
        var template = handlebars.compile(templateFile);

        //Pass data to template
        var html = template(data);

        grunt.file.write('./' + options.generatedDir + '/' + data.name + '.html', html);
        grunt.log.writeln('HTML file created at:  "' + options.generatedDir + '/' + data.name + '.html"');
      });
    };

    var getExtension = function(filename) {
      var i = filename.lastIndexOf('.');
      return (i < 0) ? '' : filename.substr(i);
    };

    // Iterate over all specified file groups (ie: output destination(s)).
    this.files.forEach(function (file) {
      // Concat specified files.
      var output = file.src.filter(function (filepath) {
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
        var parsedResult;

        // Handle options.
        // Take file source, convert to string and parse for regexp matches
        parsedResult = parseLines(src.toString(), fileExt);

        if (!options.debug) {
          removeDataComments(src.toString(), filepath);
        }

        return {
          collection: parsedResult.map(function(item) {
            var data = {};
            // Remove newlines and spaces (\n, \s)
            src = stripInvisibles(item.source);

            if (item.type === 'data') {
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
                type: 'data'
              };
            }
            else if (item.type) {
              return {
                source: item.source,
                type: item.type,
                name: path.basename(filepath, '.' + item.type)
              };
            }
            else {
              grunt.log.error('Type Error! must be "data" or "html"');
              return {
                source: '',
                type: 'error'
              };
            }
          })
        };

      });

      if (output.length < 1) {
        grunt.log.warn('Destination not written because file were empty.');
      }
      else {
        var jsonData;
        var jsonArray = [];

        output.forEach(function(item) {

          // Grab all JSON data within files
          jsonData = _.pluck(_.where(item.collection, {type: 'data'}), 'source');

          // Grab all HTML data within files and write it to file
          compileToFile(_.where(item.collection, {type: 'html'}));

          // Grab all Jade data within files and write it to file
          compileToFile(_.where(item.collection, {type: 'jade'}));

          // Grab all swig data within files and write it to file
          compileToFile(_.where(item.collection, {type: 'swig'}));

          if (jsonData.length > 1) {
            jsonData = jsonData.join(',');
          }
          else {
            jsonData = jsonData.join('');
          }

          if (jsonData !== '') {
            jsonArray.push(jsonData);
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
              name: toTitleCase(val)
            };
          });

          // Grab all categories
          var statuses = _.pluck(handlebarsOptions.generated, 'status');
          statuses = _.uniq(statuses);
          statuses = statuses.map(function(val) {
            return {
              class: val,
              name: toTitleCase(val)
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

          handlebars.registerHelper('ifvalue', function (conditional, config) {
            if (config.hash.value === conditional) {
              return config.fn(this);
            }
            else {
              return config.inverse(this);
            }
          });

          var templateFile = grunt.file.read(options.dashTemplate);

          // Render out HTML from tempate
          var template = handlebars.compile(templateFile);

          var html = template(handlebarsOptions);

          // Remove filename from file.dest path
          // ie dashboard/index.html => dashboard/
          var assetDir = file.dest.split('/');
          assetDir.pop();

          // Write the destination file.
          grunt.file.write(file.dest, html);

          var assets;

          // Grab all files from `options.assets` array
          options.assets.forEach(function(item) {
            assets = grunt.file.expand({cwd: item.cwd}, item.src);

            // Copy each file to the same directory where the dashboard will be generated
            assets.forEach(function(filePath) {
              if (grunt.file.isFile(item.cwd + filePath)) {
                grunt.file.copy(item.cwd + filePath, assetDir.join('/') + '/' + filePath);
                grunt.log.debug('%s created at: %s', filePath, assetDir.join('/') + '/' + filePath);
              }
              else if (grunt.file.isDir(item.cwd + filePath)) {
                return;
              }
            });
          });

          // console.log(assets);

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
