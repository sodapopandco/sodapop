var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
    proxy: "heft.dev",
    xip: true
  });
});

gulp.task('css', function () {
  return gulp.src('source/_assets/styles/**/*.scss')
    .pipe(sass({ errLogToConsole: true, sourceComments: 'map', sourceMap: 'sass' }))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(reload({stream:true}));
});

gulp.task('default', ['css', 'browser-sync'], function() {
  gulp.watch('source/**/*.scss', ['css']);
});
