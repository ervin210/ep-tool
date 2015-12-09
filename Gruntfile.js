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
      express: {
         dev: {
            options: {
               script: 'main.js'
            }
         }
      },
      watch: {
         express: {
            files: [ '**/*.js' ],
            tasks: [ 'express:dev' ],
            options: {
               spawn: false
            }
         }
      }
   });

   // Load the plugin that provides the "uglify" task.
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-express-server');
   grunt.loadNpmTasks('grunt-contrib-watch');

   // Default task(s).
   grunt.registerTask('default', ['express:dev', 'watch']);

};
