var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var jade = require('gulp-pug');

var paths = {
  sass: ['**/*.scss', '!node_modules/**'],
  jade: ['**/*.jade', '!node_modules/**']
}

gulp.task('default', ['sass', 'jade'])

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(gulp.dest('.'));
});

gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('.'));
})

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jade, ['jade']);
})
