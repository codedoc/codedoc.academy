var gulp = require('gulp');
var shell = require('gulp-shell');
var sequence = require('run-sequence');

gulp.task('vulcanize', shell.task([
  'rm -rf client/dist',
  'mkdir client/dist',
  'vulcanize -o client/dist/index.html --strip --csp --inline client/index.html'
]));

gulp.task('all', function (done) {
  sequence('vulcanize', done);
});

gulp.task('default', ['all']);
