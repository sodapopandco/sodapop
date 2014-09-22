var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    changed = require('gulp-changed'),
    childProcess = require('child_process'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    uglify = require('gulp-uglify'),
    reload = browserSync.reload;

// Serves and reloads the browser when stuff happens.
gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
    proxy: "heft.dev"
  });
});

// Minifies any images.
gulp.task('images', function () {
  return gulp.src('source/_assets/images/**/*')
    .pipe(changed('public/assets/images'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('public/assets/images'))
    .pipe(reload({stream:true}));
});

gulp.task('scripts', function () {
  return gulp.src('source/_assets/scripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/assets/scripts'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/assets/scripts'))
    .pipe(reload({stream:true}));
});

// Compiles any Sass files, minifies them, and injects any changed CSS into the browser.
gulp.task('styles', function () {
  return gulp.src('source/_assets/styles/*.scss')
    .pipe(sass({
      // This is needed to stop the build failing.
      // Maybe source maps are required now?
      sourceComments: 'map'
    }))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(reload({stream:true}));
});

// Builds the site.
gulp.task('build', function (done) {
  return childProcess.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Builds and reloads the site.
gulp.task('rebuild', ['build'], function () {
  reload();
});

// Builds the site, compiles its CSS, and syncs the changes to the browser.
gulp.task('default', ['build', 'images', 'scripts', 'styles', 'browser-sync'], function() {
  gulp.watch('source/_assets/images/**/*', ['images']);
  gulp.watch('source/**/*.js', ['scripts']);
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch(['*.yml', 'source/**/*.html', 'source/**/*.md', 'source/**/*.txt'], ['rebuild']);
});
