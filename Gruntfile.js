/*global module:false*/
module.exports = function(grunt) {

  // Load tasks automatically.
  require('load-grunt-tasks')(grunt);

  // Project directories.
  srcDir = './source/';
  destDir = './public/';
  srcAssetsDir = './source/_assets/';
  destAssetsDir = './public/assets/';
  imagesDir = 'images/';
  scriptsDir = 'scripts/';
  stylesDir = 'styles/';

  // Project domains.
  localDomain = 'domain';
  remoteDomain = 'domain.com';

  // Project configuration.
  grunt.initConfig({

    // Task configuration.
    autoprefixer: {
      prefix: {
        expand: true,
        cwd: destAssetsDir + stylesDir,
        src: ['**/*.css', '!**/*.min.css'],
        dest: destAssetsDir + stylesDir
      }
    },

    clean: {
      all: [destDir + '*'],
      images: [destDir + '**/*.{gif,jpg,png,svg}'],
      markup: [destDir + '**/*.{html,txt}'],
      scripts: [destAssetsDir + scriptsDir + '*'],
      styles: [destAssetsDir + stylesDir + '*']
    },

    coffee: {
      compile: {
        expand: true,
        cwd: srcAssetsDir + scriptsDir,
        src: ['**/*.coffee'],
        dest: destAssetsDir + scriptsDir,
        ext: '.js'
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      check: {
        expand: true,
        cwd: destAssetsDir + stylesDir,
        src: ['**/*.css', '!**/*.min.css']
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      compress: {
        expand: true,
        cwd: destAssetsDir + stylesDir,
        src: ['**/*.css', '!**/*.min.css'],
        dest: destAssetsDir + stylesDir,
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
        cwd: destDir,
        src: ['**/*.html'],
        dest: destDir
      }
    },

    imagemin: {
      compress: {
        expand: true,
        cwd: srcAssetsDir + imagesDir,
        src: ['**/*.{gif,jpg,png,svg}'],
        dest: destAssetsDir + imagesDir
      }
    },

    jekyll: {
      options: {
        bundleExec: true
      },
      build: {
        src: srcDir,
        dest: destDir
      }
    },

    jshint: {
      self: [
        'Gruntfile.js'
      ],
      check: {
        expand: true,
        cwd: destAssetsDir + scriptsDir,
        src: ['**/*.js', '!**/*.min.js'],
      }
    },

    sass: {
      options: {
        bundleExec: true
      },
      compile: {
        expand: true,
        cwd: srcAssetsDir + stylesDir,
        src: ['**/*.scss'],
        dest: destAssetsDir + stylesDir,
        ext: '.css'
      }
    },

    shell: {
      pow: {
        command: [
          'ln -s `pwd` ~/.pow/' + localDomain,
          'echo "Done. Now serving this site locally at http://' + localDomain + '.dev."'
        ].join('&&')
      }
    },

    uglify: {
      compile: {
        expand: true,
        cwd: destAssetsDir + scriptsDir,
        src: ['**/*.js', '!**/*.min.js'],
        dest: destAssetsDir + scriptsDir,
        ext: '.min.js'
      }
    },

    watch: {
      options: {
        livereload: 9000
      },
      images: {
        files: [srcDir + '**/*.{gif,jpg,png,svg}'],
        tasks: ['imagemin']
      },
      markup: {
        files: [srcDir + '**/*.{html,md,txt}'],
        tasks: ['jekyll']
      },
      scripts: {
        files: [srcDir + '**/*.coffee'],
        tasks: ['compile:js']
      },
      styles: {
        files: [srcDir + '**/*.scss'],
        tasks: ['compile:css']
      }
    }
  });

  // Main tasks.
  grunt.registerTask('build', ['clean:all', 'compile', 'compress']);
  grunt.registerTask('compile', ['jekyll', 'compile:css', 'compile:js']);
  grunt.registerTask('compile:css', ['sass', 'autoprefixer', 'csslint']);
  grunt.registerTask('compile:js', ['coffee', 'jshint']);
  grunt.registerTask('compress', ['htmlmin', 'imagemin', 'cssmin', 'uglify']);

  // Default task.
  grunt.registerTask('default', ['watch']);

};
