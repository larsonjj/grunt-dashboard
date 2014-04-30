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
            logo: 'data:image/png;base64,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'
        });

        var handlebarsOptions = {};

        // Remove whitespace and newlines
        var stripInvisibles = function(string) {
            return string.replace(/\n/g, '').replace(/\s/g, '').replace(/\t/g, '');
        };

        var toTitleCase = function (str)
        {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };

        var parseLines = function(str) {
             var lines = str.replace(/\r\n/g, '\n').split(/\n/);
             var lineArray = [];
             var contentArray = [];
             var record = false;
             var type;

             lines.some(function (line) {
                // Build Regex
                var regbuild = new RegExp('<!--\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*');
                // end build pattern -- [/dash] -->
                var regend = new RegExp('\\s*\\[\\s*\\/\\s*' + options.searchTerm + '\\s*\\]\\s*');
                var indent = (line.match(/^\s*/) || [])[0];
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
            var regAll = new RegExp('<!--\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*(.|\n)*-->');
            var containsData = regAll.test(str);
            if (containsData) {
                grunt.file.write(filepath, str.replace(regAll, ''));
            }
        };

        // Iterate over all specified file groups (ie: output destination(s)).
        this.files.forEach(function (file) {
            // Concat specified files.
            var output = file.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                // Read file source.
                var src = grunt.file.read(filepath);
                var jsonData;
                var parsedResult;

                // Handle options.
                // Take file source, convert to string and parse for regexp matches
                parsedResult = parseLines(src.toString());

                if (!options.debug) {
                    removeDataComments(src.toString(), filepath);
                }

                return {
                    collection: parsedResult.map(function(item) {
                        // Remove newlines and spaces (\n, \s)
                        src = stripInvisibles(item.source);

                        if (item.type === 'data') {
                            // Test to make sure data is JSON compatible
                            try {
                                 jsonData = JSON.parse(src);
                            }
                            catch (e) {
                                 grunt.log.error('Data inside "' + file.src + '" is not in correct JSON format');
                                 grunt.log.error('------- Details Below -------');
                                 grunt.log.errorlns(e);
                            }

                            // Set a default label if none is found
                            if (!jsonData.label) {
                                jsonData.label = path.basename(filepath, '.html');
                            }

                            // Set a default link if none is found
                            if (!jsonData.link) {
                                jsonData.link = '/' + filepath;
                            }

                            // Set a default status if none is found
                            if (!jsonData.status) {
                                jsonData.status = 'unknown';
                            }

                            // Set a default category if none is found
                            if (!jsonData.category) {
                                jsonData.category = 'unknown';
                            }

                            return {
                                source: JSON.stringify(jsonData),
                                type: 'data'
                            };
                        }
                        else if (item.type === 'html') {
                            return {
                                source: item.source,
                                type: 'html',
                                name: path.basename(filepath, '.html')
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
                var array =[];

                output.forEach(function(item) {

                    jsonData = _.pluck(_.where(item.collection, {type: 'data'}), 'source');

                    if (jsonData.length > 1) {
                        jsonData = jsonData.join(',');
                    }
                    else {
                        jsonData = jsonData.join('');
                    }

                    if (jsonData !== '') {
                        array.push(jsonData);
                    }
                });

                if (array.length > 0) {
                    console.log(array);

                    // Create data object
                    handlebarsOptions.data = JSON.parse('[' + array.join(',') + ']');

                    // Grab all categories
                    var categories = _.pluck(handlebarsOptions.data, 'category');
                    categories = _.uniq(categories);
                    categories = categories.map(function(val) {
                        return {
                            class: val,
                            name: toTitleCase(val)
                        };
                    });

                    // Grab all categories
                    var statuses = _.pluck(handlebarsOptions.data, 'status');
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

                    handlebars.registerHelper('ifvalue', function (conditional, options) {
                        if (options.hash.value === conditional) {
                            return options.fn(this);
                        } else {
                            return options.inverse(this);
                        }
                    });

                    var templateFile = grunt.file.read(options.dashTemplate);

                    // Render out HTML from tempate
                    var template = handlebars.compile(templateFile);

                    var html = template(handlebarsOptions);

                    // Write the destination file.
                    grunt.file.write(file.dest, html);

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
