var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

gulp.task('css', function () {
  return gulp.src('source/_assets/styles/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('public/assets/styles'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/styles'))
});

gulp.task('default', ['css'], function() {
  gulp.watch("source/**/*.scss", ['css']);
});
