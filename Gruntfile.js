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
  liveDomain = 'domain.com';
  repoDomain = 'user/repository';

  // Project configuration.
  grunt.initConfig({

    // Task configuration.
    autoprefixer: {
      prefix: {
        expand: true,
        cwd: destAssetsDir + stylesDir,
        src: ['**/*.css'],
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
        src: ['**/*.css']
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      compress: {
        expand: true,
        cwd: destAssetsDir + stylesDir,
        src: ['**/*.css'],
        dest: destAssetsDir + stylesDir
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
        src: ['**/*.js'],
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
      github: {
        command: 'open http://github.com/' + repoDomain
      },
      production: {
        command: 'open http://' + liveDomain
      },
      pow: {
        command: [
          'ln -s `pwd` ~/.pow/' + localDomain,
          'echo "Done. Now serving this site locally at http://' + localDomain + '.dev."'
        ].join('&&')
      },
      preview: {
        command: 'open http://' + localDomain + '.dev'
      }
    },

    uglify: {
      compile: {
        expand: true,
        cwd: destAssetsDir + scriptsDir,
        src: ['**/*.js'],
        dest: destAssetsDir + scriptsDir
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
  grunt.registerTask('view', ['build', 'shell:preview']);
  grunt.registerTask('view:live', ['shell:production']);
  grunt.registerTask('view:repo', ['shell:github']);

  // Default task.
  grunt.registerTask('default', ['watch']);

};
