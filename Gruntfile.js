/*global module:false*/
module.exports = function(grunt) {

  // Load tasks automatically.
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Task configuration.
    autoprefixer: {
      prefix: {
        expand: true,
        cwd: 'public/assets/styles',
        src: ['**/*.css', '**/!*.min.css'],
        dest: 'public/assets/styles'
      }
    },

    clean: {
      all: ['public/*'],
      markup: ['public/**/*.html', 'public/**/*.txt'],
      styles: ['public/assets/styles/*']
    },

    csslint: {
      default: {
        expand: true,
        cwd: 'public/assets/styles',
        src: ['**/*.css', '**/!*.min.css'],
        dest: 'public/assets/styles'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      compress: {
        expand: true,
        cwd: 'public/assets/styles',
        src: ['**/*.css', '**/!*.min.css'],
        dest: 'public/assets/styles',
        ext: '.min.css'
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      default: {
        expand: true,
        cwd: 'public',
        src: ['**/*.html'],
        dest: 'public'
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

    jshint: {
      check: ['Gruntfile.js', 'source/**/*.js']
    },

    sass: {
      options: {
        bundleExec: true
      },
      compile: {
        expand: true,
        cwd: 'source/_assets/styles',
        src: ['**/*.scss'],
        dest: 'public/assets/styles',
        ext: '.css'
      }
    },

    uglify: {
      compile: {
        expand: true,
        cwd: 'source/_assets/scripts',
        src: 'main.js',
        dest: 'public/assets/scripts',
        ext: '.min.js'
      }
    },

    watch: {
      options: {
        livereload: 9000
      },
      markup: {
        files: ['source/**/*.html', 'source/**/*.md', 'source/**/*.txt'],
        tasks: ['jekyll', 'compile']
      },
      sass: {
        files: ['source/**/*.scss'],
        tasks: ['compile']
      }
    }
  });

  // Compile styles.
  grunt.registerTask('build', ['jekyll', 'compile']);
  grunt.registerTask('compile', ['sass', 'autoprefixer', 'csslint', 'uglify', 'jshint']);
  grunt.registerTask('compress', ['htmlmin', 'cssmin', 'uglify']);

  // Default task.
  grunt.registerTask('default', ['watch']);

};
