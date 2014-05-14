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

#### options.searchTerm
Type: `String`
Default value: `dash`

A string value that is used to determine your data search pattern.

#### options.generatedDir
Type: `String`
Default value: `dashboard/generated`

A string value that is used to determine where the dashboard html file with be generated.

#### options.dashTemplate
Type: `String`
Default value: `node_modules/grunt-dashboard/dashboard/dashboard-template.hbs`

A string value that is used to determine what handlebars template should be used for generating the dashboard.

#### options.htmlTemplate
Type: `String`
Default value: `node_modules/grunt-dashboard/dashboard/html-template.hbs`

A string value that is used to determine what handlebars template should be used for generating components and other HTML partials.

#### options.logo
Type: `String`
Default value: `empty`

A string value that is used to determine what image should be used in a template as a logo.

#### options.debug
Type: `Boolean`
Default value: `true`

A boolean value that is used to determine if data comments in your HTML files should be removed.
This would mostly be used for when you are doing a production build.

#### options.assets
Type: `Array`
Default value: `[]`

An array of files that will act as includes for any supported markup preprocessor (Jade, EJS, etc).
This would mostly be used for including files with mixins within them.

### Usage Examples

#### Default Options
In this example, the default options are used to parse JSON data from within an HTML file. So when the task below runs, it will create a `index.html` file within the `dashboard` directory built from all the scanned HTML files within the `html` directory.

`html/index.html`:
```html
<!--[dash:data]
{
    "status": "development",
    "category": "page",
    "label": "Home",
    "link": "path/to/file/index.html"
}
[/dash] -->
```

`Gruntfile.js`
```js
grunt.initConfig({
  dashboard: {
    options: {},
    files: {
      'dashboard/index.html': ['html/*.html'],
    },
  },
})
```

#### Custom Options
In this example, you can see that the `options.searchTerm` property is used to change what pattern to look for. This new pattern i.e. `[custom:data]` will be used to parse for JSON data from within an HTML file. So when the task below runs, it will create a `index.html` file within the `dashboard` directory built from all the scanned HTML files within the `html` directory. Notice the second set of `[custom]` comments: This will also build out an HTML partial file using the markup within the `[custom:html]` comments using the handlebars template specified with `options.htmlTemplate`.

`html/index.html`:
```html
<!--[custom:data]
{
    "status": "development",
    "category": "page",
    "label": "Home",
    "link": "path/to/file/index.html"
}
[/custom] -->
<!--[custom:html]
<div>
    <h1>Testing</h1>
    <p>
        This is just a simple test
    <p>
</div>
[/custom] -->
```

`Gruntfile.js`
```js
grunt.initConfig({
  dashboard: {
    options: {
      searchTerm: 'custom',
      dashTemplate: 'dashboard/dashboard-template.hbs',
      htmlTemplate: 'dashboard/html-template.hbs',
      generatedDir: 'dashboard/generated'
    },
    files: {
      'dashboard/index.html': ['html/*.html']
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
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
Copyright (c) 2014 Jake Larson. Licensed under the MIT license.
