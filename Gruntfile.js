var _ = require('lodash');

module.exports = function(grunt) {

   var buildJsOptions = {
      optimize: 'none',
      appDir: 'static/js',
      baseUrl: '.',
      dir: 'static-js',
      paths: {
         underscore: 'lib/underscore'
      },
      shim: {
         'jquery': {
            deps: [],
            exports: '$'
         },
         'aui': {
            'deps': ['jquery'],
            'exports': 'AJS'
         }
      },
      wrapShim: true,
      modules: [{
         name: 'app/issue-entity-properties'
      }, {
         name: 'app/project-entity-properties'
      }, {
         name: 'app/user-entity-properties'
      }, {
         name: 'app/issue-type-entity-properties'
      }]
   };

   var prodJsOptions = _.merge({}, buildJsOptions, {
      optimize: 'uglify2'
   });

   var buildCssOptions = {
      files: {
         "static-css/all.css": "static/less/all.less"
      }
   };

   var prodCssOptions = _.merge({}, buildCssOptions, {
      options: {
         compress: true
      }
   });

   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
         },
         build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'build/<%= pkg.name %>.min.js'
         }
      },
      requirejs: {
         compile: {
            options: buildJsOptions
         },
         prod: {
            options: prodJsOptions
         }
      },
      less: {
         compile: buildCssOptions,
         prod: prodCssOptions
      },
      express: {
         dev: {
            options: {
               script: 'main.js'
            }
         }
      },
      watch: {
         express: {
            files: [ 
               'Gruntfile.js',
               'main.js',
               'views/*.mustache'
            ],
            tasks: [ 'express:dev' ],
            options: {
               spawn: false
            }
         },
         requirejs: {
            files: [ 
               'Gruntfile.js',
               'static/js/**/*.js' 
            ],
            tasks: [ 'requirejs:compile' ]
         },
         less: {
            files: [ 'static/less/**/*.less' ],
            tasks: [ 'less:compile' ]
         }
      }
   });

   // Load the plugin that provides the "uglify" task.
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-express-server');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-requirejs');
   grunt.loadNpmTasks('grunt-contrib-less');

   // Default task(s).
   grunt.registerTask('default', ['requirejs:compile', 'less:compile', 'express:dev', 'watch']);
};
