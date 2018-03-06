var gulp = require('gulp');
var cordova = require('cordova-lib').cordova;

gulp.task('default', function(callback) {
  cordova.build({
    'platforms': ['android'],
    'options': {
      argv: ['--gradleArg=--no-daemon']
    }
  }, callback);
});
