var gulp = require('gulp');
var gutil = require('gulp-util');
var argv = require('yargs')
  .usage('Usage: gulp [--production]')
  .argv;

var jshint = require('gulp-jshint');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

var SRC_HTML = './src/html/**/*.html';
var SRC_LESS = './src/less/**/*.less';
var SRC_JS = './src/js/**/*.js';

// Lint Task
gulp.task('lint', function() {
  // Don't lint the libs
  return gulp.src([SRC_JS, '!./src/js/libs/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

var bundleStreamBuilder = function(watch) {
  var bundleCreator = browserify;

  if (watch) {
    bundleCreator = watchify;
  }

  var bundler = bundleCreator('./src/js/Main.js');

  function bundle() {
    return bundler.bundle({
      debug: !argv.production
    })
    .on('error', function(err) {
      gutil.log(gutil.colors.bgRed('Error'), err.message);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js/'));
  };

  if (watch) {
    bundler.on('update', bundle);
    bundler.on('time', function(time) {
      gutil.log(gutil.colors.green('[Browserify]'), 
        'packaged in', 
        gutil.colors.magenta(time),
        gutil.colors.magenta('ms'));
    });
  }

  return bundle();
};

gulp.task('js', function() {
  return bundleStreamBuilder();
});

gulp.task('html', function() {
  return gulp.src(SRC_HTML)
    .pipe(gulp.dest('./build/'));
});

gulp.task('less', function() {
  if (argv.production) {
    return gulp.src(SRC_LESS)
      .pipe(less())
      .pipe(gulp.dest('./build/css/'));
  } else {
    return gulp.src(SRC_LESS)
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./build/css/'));
  }
});

gulp.task('watch', function() {
  gulp.watch(SRC_HTML, ['html']);
  gulp.watch(SRC_LESS, ['less']);
  gulp.watch(SRC_JS, ['lint']);
  bundleStreamBuilder(true);
});

gulp.task('default', ['lint', 'html', 'less', 'js']);
gulp.task('dev', ['lint', 'html', 'less', 'watch']);
