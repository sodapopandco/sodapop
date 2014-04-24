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

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['watch']);

};
