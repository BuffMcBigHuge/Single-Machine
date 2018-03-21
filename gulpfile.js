/**
 * SINGLE MACHINE - gulpfile.js
 * (c) 2018
*/

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-clean-css');
var ngAnnotate = require('gulp-ng-annotate');
var decomment = require('gulp-decomment');
var minifyejs = require('gulp-minify-ejs');
var removeHtmlComments = require('gulp-remove-html-comments');

gulp.task('minify-css', function(){
    return gulp.src('app/stylesheets/*.css')
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        //.pipe(decomment({trim: true}))
        .pipe(gulp.dest('app/assets'), {overwrite: true});
});

gulp.task('minify-js', function(){
    return gulp.src([
        'app/app.js',
        'app/directives/*.js',
        'app/factory/*.js',
        'app/services/*.js',
        'app/components/*.js',
        'app/controllers/*.js'
    ])
        .pipe(concat('main.js'))
        .pipe(decomment({trim: true}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('app/assets'), {overwrite: true});
});

gulp.task('minify-ejs', function(){
    return gulp.src([
        'app/main.ejs'
    ])
        .pipe(minifyejs())
        .pipe(removeHtmlComments())
        .pipe(gulp.dest('app/assets'), {overwrite: true});
});

gulp.task('default', [
    'minify-css',
    'minify-js',
    'minify-ejs'
]);

// EOF

