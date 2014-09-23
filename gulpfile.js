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
    uglify = require('gulp-uglify'),
    reload = sync.reload;

// Serves and reloads the browser when stuff happens.
gulp.task('browser-sync', function() {
  sync({
    notify: false,
    proxy: "heft.dev"
  });
});

// Builds the site.
gulp.task('build', function(done) {
  return child.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Builds and reloads the site.
gulp.task('rebuild', ['build'], function() {
  reload();
});

gulp.task('clean', function() {
  return gulp.src('public')
    .pipe(clean());
});

// Minifies any images.
gulp.task('images', function() {
  return gulp.src('source/_assets/images/**/*')
    .pipe(changed('public/assets/images'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('public/assets/images'))
    .pipe(reload({stream:true}));
});

// Compiles any JavaScript files, minifies them, and reloads the browser.
gulp.task('scripts', function() {
  return gulp.src('source/_assets/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/assets/scripts'))
    .pipe(reload({stream:true}));
});

// Compiles any Sass files, minifies them, and injects any changed CSS into the browser.
gulp.task('styles', function() {
  return gulp.src('source/_assets/styles/*.scss')
    .pipe(sass({
      // This is needed to stop the build failing.
      // Maybe source maps are required now?
      sourceComments: 'map'
    }))
    .pipe(autoprefixer('last 4 version'))
    .pipe(mincss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(reload({stream:true}));
});

// Builds the site, compiles its CSS, and syncs the changes to the browser.
gulp.task('default', ['clean', 'build', 'images', 'scripts', 'styles', 'browser-sync'], function() {
  gulp.watch('source/_assets/images/**/*', ['images']);
  gulp.watch('source/**/*.js', ['scripts']);
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch(['*.yml', 'source/**/*.html', 'source/**/*.md', 'source/**/*.txt'], ['rebuild']);
});
