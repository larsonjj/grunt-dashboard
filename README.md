# grunt-dashboard

> Generates a static dashboard based on data parsed within specified files

### NOTE: Still under heavy development - use at your own risk.


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

#### options.symbol
Type: `String`
Default value: `!`

A string value that is used to determine your data search pattern.
The default Regular Expression pattern is `/!##([^;]*?)##!/g` - `Note the '!' comes from the options.symbol`

### Usage Examples

#### Default Options
In this example, the default options are used to parse JSON data from within an HTML file. So when the task below runs, it will create a `index.json` file that will contain the json data: `{"status":"dev"}`.

`html/index.html`:
```html
<!-- !##
{
  "status": "dev"
}
##! -->
```

`Gruntfile.js`
```js
grunt.initConfig({
  dashboard: {
    options: {},
    files: {
      'json/index.json': ['html/index.html'],
    },
  },
})
```

#### Custom Options
In this example, you can see that the `options.symbol` property is used to change what pattern to look for. This new pattern i.e. `@## ##@` will be used to parse for JSON data from within an HTML file. So when the task below runs, it will create a `json` file that will contain the json data: `{"status":"dev"}`.

`html/index.html`:
```html
<!-- @##
{
  "status": "dev"
}
##@ -->
```

`Gruntfile.js`
```js
grunt.initConfig({
  dashboard: {
    options: {
      symbol: '@'
    },
    files: {
      'json/index.json': ['html/index.html'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.0.1 - Initial alpha release

## License
Copyright (c) 2014 Jake Larson. Licensed under the MIT license.
