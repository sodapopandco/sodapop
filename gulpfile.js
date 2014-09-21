var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    childProcess = require('child_process'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    shell = require('gulp-shell'),
    reload = browserSync.reload;

gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
    proxy: "heft.dev",
    xip: true
  });
});

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

gulp.task('build', function (done) {
  return childProcess.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('rebuild', ['build'], function () {
  reload();
});

gulp.task('default', ['build', 'styles', 'browser-sync'], function() {
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch(['*.md', '*.yml', 'source/**/*.html'], ['rebuild']);
});
