/*
 * grunt-dashboard
 * https://github.com/larsonjj/grunt-dashboard
 *
 * Copyright (c) 2014 Jake Larson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('dashboard', 'Generates a static dashboard based on data parsed within specified files', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      symbol: '!'
    });

    // Build Regex
    var regExp = new RegExp(options.symbol + '##([^;]*?)##' + options.symbol, 'g');

    // Strip out regex symbols
    var stripSymbols = function(string) {
        return string.replace(options.symbol + '##', '').replace('##' + options.symbol, '');
    };

    // Remove whitespace and newlines
    var stripInvisibles = function(string) {
      return string.replace(/\n/g, '').replace(/\s/g, '');
    };

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {

      // Concat specified files.
      var src = file.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      });

      // Handle options.
      // Take file source, convert to string and parse for regexp matches
      // Only take the first match (because the data should be at the top of the file anyway) and strip away the search symbols (e.g. !## or ##!)
      src = stripSymbols(src
            .toString()
            .match(regExp)[0]);

      // Remove newlines and spaces (\n, \s)
      src = stripInvisibles(src);

      // Test to make sure data is JSON compatible
      try {
         JSON.parse(src);
      }
      catch (e) {
         grunt.log.error('Data inside "' + file.src + '" is not in correct JSON format');
         grunt.log.error('------- Details Below -------');
         grunt.log.errorlns(e);

      }

      // Write the destination file.
      grunt.file.write(file.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + file.dest + '" created.');
    });
  });

};
