# grunt-dashboard [![Build Status](https://secure.travis-ci.org/larsonjj/generator-yeogurt.png?branch=master)](https://travis-ci.org/larsonjj/grunt-dashboard) [![NPM version](https://badge.fury.io/js/grunt-dashboard.svg)](http://badge.fury.io/js/grunt-dashboard)

> Generates a static dashboard based on data parsed within specified files

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-dashboard --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dashboard');
```

## The "dashboard" task

### Overview
In your project's Gruntfile, add a section named `dashboard` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  dashboard: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.compiler
Type: `Object`
Default value: `undefined`

Compiler you would like to use for rendering templates. The compiler you use must have a `render` method in order to work (ex. Jade, Swig, etc)

> NOTE: You will need to install your desired template compiler and require it as the value of the compile key

Example:
```js
options: {
  compiler: require('jade')
}
```

#### options.compilerOptions
Type: `Object`
Default value: `{}`

Compiler options you would like to pass into your desired compiler.

Example:
```js
options: {
  compiler: require('jade'),
  compilerOptions: {pretty: true, filename: true}
}
```

#### options.generatedDir
Type: `String`
Default value: `dashboard/generated`

A string value that is used to determine where the dashboard html file will be generated.

#### options.dashTemplate
Type: `String`
Default value: `node_modules/grunt-dashboard/dashboard/dashboard-template.hbs`

A string value that is used to determine what handlebars template should be used for generating the dashboard.

#### options.moduleTemplate
Type: `String`
Default value: `node_modules/grunt-dashboard/dashboard/module-template.hbs`

A string value that is used to determine what handlebars template should be used for generating components and other HTML partials.

#### options.logo
Type: `String`
Default value: `''`

A string value that is used to determine what image should be used in a template as a logo.

#### options.data
Type: `Object`
Default value: `{}`

An object of custom variables that will be passed to the Handlebars template. Useful if you want to pass things like version information or other custom variables from your Grunt build process.

#### options.includes
Type: `Array`
Default value:
```
[{
    cwd: 'node_modules/grunt-dashboard/dashboard/assets/',
    src: [
        '**/*'
    ]
}]
```

An array of file objects that will be copied over with the dashboard html file to the same output directory.
The file object properties available to you are:
***cwd***
directory assets are located in.

***src***
file search pattern, (*) is a wildcard that matches everything

This would mostly be used for including external stylesheets or scripts you want to use within a custom dashboard template.

### Usage Examples

#### Default Options
In this example, the default options are used to parse JSON data from within a `*.dash.json`. So when the task below runs, it will create a `index.html` file within the `dashboard` directory built from all the scanned JSON files within the `index` directory.

`index/index.dash.json`:
```json
{
    "status": "development",
    "category": "page",
    "label": "Home",
    "link": "path/to/file/index.html"
}
```

`Gruntfile.js`
```js
grunt.initConfig({
  dashboard: {
    options: {},
    files: {
      'dashboard/index.html': ['index/*.dash.json'],
    },
  },
})
```

#### Custom Compiler Options
In this example, you can see that the `options.compiler` property is used to control which compiler to use for rendering module templates.
So when the task below runs, it will create a `index.html` file within the `dashboard` directory built from all the scanned Jade files within the `index` directory.
Notice the `index/index.dash.jade` example: This will build out an HTML partial file using the markup within that file using the jade compiler.
It's compiled source will then be rendered out to the handlebars template specified with `options.moduleTemplate`.

`index/index.dash.json`:
```json
{
    "status": "development",
    "category": "page",
    "label": "Home",
    "link": "path/to/file/index.html"
}
```

`index/index.dash.jade`
```jade
div
  h1 Testing
    p
      This is just a simple test
```

`Gruntfile.js`
```js
grunt.initConfig({
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
    'dashboard/index.html': ['index/*.dash.{json,jade}'],
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
<strong>v1.0.2</strong> - Added options.data to module handlebars templates.

<strong>v1.0.1</strong> - Updated Underscore to 1.8.2. Updated Underscore.string to 3.0.3.

<strong>v1.0.0</strong> - Updated Less to 2.5.1. Updated jQuery to 2.1.4. Switched to eslint from jshint. Removed support for IE8. No longer parses source files, uses *.dash files for defining data and module templates. Added compiler and compilerOptions options.

<strong>v0.3.1</strong> - Updated Swig, Jade, and Handlbars to their latest versions.

<strong>v0.3.0</strong> - Added `data` option so that custom variables can be passed from the Grunt task to the Handlebars template. API break: `data` inside handlbars templates has changed to `generated`. Update your custom templates accordingly.

<strong>v0.2.1</strong> - Added `assets` option back into the task and acts as an array of file objects that refer to external assets to be loaded within a custom dashboard template. Also added less and jquery to default template.

<strong>v0.2.0</strong> - Removed `assets` option from task. Imports will now be handled by author within the `:swig` or `:jade` dash comments

<strong>v0.1.9</strong> - Updated jade and swig dependencies

<strong>v0.1.8</strong> - Added swig.setDefaults({ cache: false }); to disable caching problems with Swig modules.

<strong>v0.1.7</strong> - Removed EJS support. Removed extra console.logs. Added more test compile tasks.

<strong>v0.1.6</strong> - Removed unneeded console.logs

<strong>v0.1.5</strong> - Fixed issue with rendering swig asset files

<strong>v0.1.4</strong> - Added support for `.swig` files

<strong>v0.1.3</strong> - Made the default dashboard template responsive with a mobile menu for filters.

<strong>v0.1.2</strong> - Updated logic for generated filenames, they now all get the .html extention without their preprocessor added (ex: index.jade.html - > index.html). This should make things less confusing.

<strong>v0.1.1</strong> - Updated logic to better handle the rendering of EJS and Jade Templates. Now jade and ejs templates can be directly passed in the `files` property of the grunt task

<strong>v0.1.0</strong> - Added support for EJS and Jade data comments (`[dash:ejs]` or `[dash:jade]`). Also added `assests` option to allow for including mixins and html partials from other files to your Jade or EJS data comments

<strong>v0.0.9</strong> - Added `htmlTemplate` option to allow for `[dash:html]` comments to create HTML partials within the 'generatedDir' option.

<strong>v0.0.8</strong> - HOTFIX: fixed `debug` option regex search pattern

<strong>v0.0.7</strong> - HOTFIX: `debug` option was not working

<strong>v0.0.6</strong> - Added ability to remove data comments using `debug` option (mostly for production build purposes).

<strong>v0.0.5</strong> - Fixed dependencies to underscore and handlebars.

<strong>v0.0.4</strong> - Updated ending pattern search regex to be more leinient to better handle HTML rendered by preprocessors (ie Jade).

<strong>v0.0.3</strong> - Added `logo` option. Updated dashboard template styles and logic.

<strong>v0.0.2</strong> - Major Changes: No longer requires jade, now only depends on HTML. Default dashboard template is not also written in HTML + Handlebars. Search pattern has changed to something more readable (ie `<!--[custom:data] [/custom] -->`). More options have been added/changed: `symbol` is now `searchTerm`, added 'generatedDir', and added 'dashTemplate'.

<strong>v0.0.1</strong> - Initial alpha release

## License
Copyright (c) 2014-2015 Jake Larson. Licensed under the MIT license.
