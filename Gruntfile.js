module.exports = function(grunt) {

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
            options: {
               optimize: 'none',
               appDir: 'static/js',
               baseUrl: '.',
               dir: 'static-js',
               paths: {
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
               modules: [
                  {
                     name: 'app/issue-entity-properties'
                  }
               ]
            }
         }
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
            tasks: [ 'requirejs' ]
         }
      }
   });

   // Load the plugin that provides the "uglify" task.
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-express-server');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-requirejs');

   // Default task(s).
   grunt.registerTask('default', ['express:dev', 'watch']);

};
