// Project directories.
var sourceDir = './source/',
    sourceAssetsDir = '_assets/',
    destinationDir = './public/',
    destinationAssetsDir = 'assets/',
    imagesDir = 'images/',
    scriptsDir = 'scripts/',
    stylesDir = 'styles/';

// Project domains.
var localDomain = 'domain',
    liveDomain = 'domain.com',
    repoDomain = 'user/repository';

// Gulp variables.
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    child = require('child_process'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    mincss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    sync = require('browser-sync'),
    uglify = require('gulp-uglify');

// Serves and reloads the browser when stuff happens.
gulp.task('browser-sync', function() {
  sync({
    notify: false,
    proxy: "heft.dev"
  });
});

// Clean the destination directory.
gulp.task('clean', function() {
  return gulp.src('destinationDir')
    .pipe(clean());
});

// Minifies any images.
gulp.task('images', function() {
  return gulp.src(sourceDir + sourceAssetsDir + imagesDir + '**/*')
    .pipe(changed(destinationDir + destinationAssetsDir + imagesDir))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(destinationDir + destinationAssetsDir + imagesDir))
    .pipe(sync.reload({stream:true}));
});

// Builds the site.
gulp.task('jekyll', function(done) {
  return child.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Compiles any JavaScript files, minifies them, and reloads the browser.
gulp.task('scripts', function() {
  return gulp.src(sourceDir + sourceAssetsDir + scriptsDir + '*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destinationDir + destinationAssetsDir + scriptsDir))
    .pipe(sync.reload({stream:true}));
});

// Compiles any Sass files, minifies them, and injects any changed CSS into the browser.
gulp.task('styles', function() {
  return gulp.src(sourceDir + sourceAssetsDir + stylesDir + '*.scss')
    .pipe(sass({
      // This is needed to stop the build failing.
      // Maybe source maps are required now?
      sourceComments: 'map'
    }))
    .pipe(autoprefixer())
    .pipe(mincss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destinationDir + destinationAssetsDir + stylesDir))
    .pipe(sync.reload({stream:true}));
});

// Builds then reloads the site.
gulp.task('rebuild', ['jekyll'], function() {
  sync.reload();
});

// Builds the site, compiles its CSS, and syncs the changes to the browser.
gulp.task('default', ['jekyll', 'images', 'scripts', 'styles', 'browser-sync'], function() {
  gulp.watch(sourceDir + sourceAssetsDir + imagesDir + '**/*', ['images']);
  gulp.watch(sourceDir + '**/*.js', ['scripts']);
  gulp.watch(sourceDir + '**/*.scss', ['styles']);
  gulp.watch(['*.yml', sourceDir + '**/*.html', sourceDir + '**/*.md', sourceDir + '**/*.txt'], ['rebuild']);
});
