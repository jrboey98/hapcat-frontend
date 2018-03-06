var gulp = require('gulp');
var cordova = require('cordova-lib').cordova;


/// <binding BeforeBuild='add-deps' />


gulp.task('build-android',
  ['add-deps'],
  function(callback) {
    cordova.build({
      'platforms': ['android'],
      'options': {
        argv: ['--gradleArg=--no-daemon']
      }
    }, callback);
});


gulp.task('add-deps', [
  'add-bootstrap',
  'add-jquery',
  'add-fonts',
  'add-googlemaps'
]);


gulp.task('add-bootstrap', function() {
  return gulp.src('node_modules/bootstrap/dist/**/*.+(js|css)')
    .pipe(gulp.dest('www/lib/bootstrap'))
});


gulp.task('add-jquery', function() {
  return gulp.src('node_modules/jquery/dist/**/*.js')
    .pipe(gulp.dest('www/lib/jquery'))
});


gulp.task('add-googlemaps', function() {
  return gulp.src('node_modules/@google/maps/lib/**/*.js')
    .pipe(gulp.dest('www/lib/google/maps'))
});


gulp.task('add-fonts', [
  'add-lato',
  'add-dosis',
  'add-raleway',
  'add-syncopate'
]);


gulp.task('add-dosis', function() {
  return gulp.src('node_modules/typeface-dosis/**/*.+(css|woff|woff2)')
    .pipe(gulp.dest('www/lib/typeface-dosis'))
});


gulp.task('add-raleway', function() {
  return gulp.src('node_modules/typeface-raleway/**/*.+(css|woff|woff2)')
    .pipe(gulp.dest('www/lib/typeface-raleway'))
});


gulp.task('add-syncopate', function() {
  return gulp.src('node_modules/typeface-syncopate/**/*.+(css|woff|woff2)')
    .pipe(gulp.dest('www/lib/typeface-syncopate'))
});


gulp.task('add-lato', function() {
  return gulp.src('node_modules/typeface-lato/**/*.+(css|woff|woff2)')
    .pipe(gulp.dest('www/lib/typeface-lato'))
});


gulp.task('default', ['build-android']);
