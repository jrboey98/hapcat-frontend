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
gulp.task('add-deps', ['add-bootstrap']);


gulp.task('add-bootstrap', function() {
  return gulp.src('node_modules/bootstrap/dist/**/*.+(js|css)')
    .pipe(gulp.dest('www/lib/bootstrap'))
});


gulp.task('default', ['build-android']);
