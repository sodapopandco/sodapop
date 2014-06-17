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

    watch: {
      options: {
        livereload: 9000
      },
      markup: {
        files: ['source/**/*.html', 'source/**/*.md', 'source/**/*.txt'],
        tasks: ['jekyll', 'styles']
      },
      sass: {
        files: ['source/**/*.scss'],
        tasks: ['styles']
      }
    }
  });

  // Compile styles.
  grunt.registerTask('build', ['jekyll', 'sass', 'autoprefixer', 'csslint', 'cssmin']);
  grunt.registerTask('styles', ['sass', 'autoprefixer', 'csslint', 'cssmin']);

  // Default task.
  grunt.registerTask('default', ['watch']);

};
