var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  return gulp.src('./game/modules/**/*.js')
    .pipe(concat('game.js'))
    .pipe(gulp.dest('./game'));
});

gulp.task('watch', function() {
	gulp.watch('./game/modules/**/*.js').on('change', function(evt) {
		console.log('file changed: ' + evt);
		gulp.task('scripts')()
    });
});

gulp.task('default', gulp.series('scripts', 'watch'));
