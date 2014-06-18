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
        src: ['**/*.css', '!**/*.min.css'],
        dest: 'public/assets/styles'
      }
    },

    clean: {
      all: ['public/*'],
      markup: ['public/**/*.html', 'public/**/*.txt'],
      scripts: ['public/assets/scripts/*'],
      styles: ['public/assets/styles/*']
    },

    coffee: {
      compile: {
        expand: true,
        cwd: 'source/_assets/scripts',
        src: ['**/*.coffee'],
        dest: 'public/assets/scripts',
        ext: '.js'
      }
    },

    csslint: {
      check: {
        expand: true,
        cwd: 'public/assets/styles',
        src: ['**/*.css', '!**/*.min.css']
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      compress: {
        expand: true,
        cwd: 'public/assets/styles',
        src: ['**/*.css', '!**/*.min.css'],
        dest: 'public/assets/styles',
        ext: '.min.css'
      }
    },

    htmlmin: {
      options: {
        collapseWhitespace: true,
        removeComments: true
      },
      compress: {
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
      check: {
        expand: true,
        cwd: 'public/assets/scripts',
        src: ['**/*.js', '!**/*.min.js'],
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

    uglify: {
      compile: {
        expand: true,
        cwd: 'public/assets/scripts',
        src: ['**/*.js', '!**/*.min.js'],
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
        tasks: ['jekyll']
      },
      scripts: {
        files: ['source/**/*.coffee'],
        tasks: ['compile:js']
      },
      styles: {
        files: ['source/**/*.scss'],
        tasks: ['compile:css']
      }
    }
  });

  // Compile styles.
  grunt.registerTask('build', ['jekyll', 'compile']);
  grunt.registerTask('compile', ['compile:css', 'compile:js']);
  grunt.registerTask('compile:css', ['sass', 'autoprefixer', 'csslint']);
  grunt.registerTask('compile:js', ['coffee', 'jshint']);
  grunt.registerTask('compress', ['htmlmin', 'cssmin', 'uglify']);

  // Default task.
  grunt.registerTask('default', ['watch']);

};
