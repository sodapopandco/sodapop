var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
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

gulp.task('build', function () {
  return gulp.src('source/**/*.html')
    .pipe(shell(['jekyll build']))
    .pipe(reload({stream:true}));
})

gulp.task('default', ['build', 'styles', 'browser-sync'], function() {
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch('source/**/*.html', ['build']);
});
