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
      options: {
        keepSpecialComments: 0
      },
      compress: {
        expand: true,
        cwd: 'public/assets/stylesheets/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/assets/stylesheets/',
        ext: '.min.css'
      }
    },

    jekyll: {
      options: {
        bundleExec: true
      },
      build: {
        src: 'source',
        dest: 'public'
      }
    },

    sass: {
      options: {
        bundleExec: true
      },
      compile: {
        expand: true,
        cwd: 'source/_assets/stylesheets',
        src: ['*.scss'],
        dest: 'public/assets/stylesheets',
        ext: '.css'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      jekyll: {
        files: ['source/*.html'],
        tasks: ['jekyll', 'styles']
      },
      stylesheets: {
        files: ['**/*.scss'],
        tasks: ['styles']
      }
    }
  });

  // Compile styles.
  grunt.registerTask('styles', ['clean:stylesheets', 'sass', 'autoprefixer']);

  // Default task.
  grunt.registerTask('default', ['watch']);

  // These plugins provide necessary tasks.
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

};
