/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    autoprefixer: {
      files: {
        src: 'public/assets/stylesheets/*.css'
      }
    },
    clean: {
      all: ['public/*'],
      html: ['public/**/*.html'],
      stylesheets: ['public/assets/stylesheets/*']
    },
    csslint: {

    },
    cssmin: {

    },
    sass: {
      compile: {
        files: [{
          expand: true,
          cwd: 'source/_assets/stylesheets',
          src: ['*.scss'],
          dest: 'public/assets/stylesheets',
          ext: '.css'
        }]
      }
    },
    watch: {
      options: {
        livereload: true
      },
      stylesheets: {
        files: ['**/*.scss'],
        tasks: ['clean:stylesheets', 'sass', 'autoprefixer']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['watch']);

  // These plugins provide necessary tasks.
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
