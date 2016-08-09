var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-clean-css');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('minify-css',function(){
    return gulp.src('app/stylesheets/*.css')
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('app/assets'));
});

gulp.task('minify-js',function(){

    return gulp.src([
        'app/app.js',
        'app/controllers/*.js',
        'app/controllers/**/*.js',
        'app/directives/*.js',
        'app/factory/*.js',
        'app/services/*.js',
        'app/components/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('app/assets'))

});

gulp.task('default',['minify-css','minify-js']);

