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
            htmlTemplate: 'node_modules/grunt-dashboard/dashboard/html-template.hbs',
            logo: ''
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
            var regAll = new RegExp('<!--\\s*\\[' + options.searchTerm + ':(\\w+)(?:\\(([^\\)]+)\\))?\\s*([^\\s]+)\\s*[\\s\\S]*?-->', 'g');
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
                var htmlData;
                var jsonArray = [];

                output.forEach(function(item) {

                    // Grab all JSON data within files
                    jsonData = _.pluck(_.where(item.collection, {type: 'data'}), 'source');

                    // Grab all HTML data within files and write it to file
                    htmlData = _.each(_.where(item.collection, {type: 'html'}), function(data) {

                        var templateFile = grunt.file.read(options.htmlTemplate);

                        // Render out HTML from tempate
                        var template = handlebars.compile(templateFile);

                        var html = template(data);

                        grunt.file.write('./' + options.generatedDir + '/' + data.name + '.html', html);
                        grunt.log.writeln('HTML file created at:  "' + options.generatedDir + '/' + data.name + '.html"');
                    });

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
                    console.log(jsonArray);

                    // Create data object
                    handlebarsOptions.data = JSON.parse('[' + jsonArray.join(',') + ']');

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
