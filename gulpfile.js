var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var header = require('gulp-header');
var insert = require('gulp-insert');
var pkg = require('./package.json');

function getToday() {
    var today = new Date();
    return [
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
    ].join('.');
}

gulp.task('build', function() {
    var banner = ["/**",
        " * <%= pkg.projectName %> - <%= pkg.description %>",
        " * @version: <%= pkg.version %> ",
        " * @author: <%= pkg.author %> ",
        " * @homepage: <%= pkg.homepage %> ",
        " * @date: " + getToday(),
        " * @license: under MIT license",
        " */",
    ""].join("\n");
    return gulp.src('source/*.js')
        .pipe(concat('jquery.syotimer.js'))
        .pipe(insert.wrap('(function($){\n', '})(jQuery);\n'))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('build'));
});

gulp.task('compress', function() {
    var banner = "/**\n * <%= pkg.projectName %> v.<%= pkg.version %> | under MIT licence\n" +
        " * <%= pkg.homepage %>\n */\n";
    return gulp.src('source/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('jquery.syotimer.min.js'))
        .pipe(insert.wrap('(function($){\n', '})(jQuery);\n'))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('default', gulp.series('build', 'compress'));

gulp.task('watch', function() {
    gulp.watch('source/*.js', gulp.series('default'));
});

gulp.task('dev', gulp.series('default', 'watch'));