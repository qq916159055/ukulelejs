var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var webpack = require('webpack-stream');

gulp.task('clean', function () {
	return gulp.src(['dist/*'])
		.pipe(clean());
});

gulp.task('webpack', ['clean'], function () {
	return gulp.src('src/ukulele/core/Ukulele.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('dist/'));
});

gulp.task('compress', ['webpack'], function () {
	return gulp.src("dist/Ukulele.js")
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('release',['compress']);