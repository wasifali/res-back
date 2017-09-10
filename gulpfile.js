/**
 * Created by macbookpro on 12/15/15.
 */
/**
 * Created by macbookpro on 12/15/15.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');


gulp.task('dashboardNewStyle', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/dashboard/'));
});

//gulp.task('scriptscontroller', function() {
//    gulp.src('public/js/controllers/**/*.js')
//        .pipe(babel({
//            presets: ['babel-preset-es2015']
//        }))
//        .on('error', console.error.bind(console))
//        .pipe(gulp.dest('./public/scripts/'));
//});
//gulp.task('scriptsservices', function() {
//    gulp.src('public/js/services/**/*.js')
//        .pipe(babel({
//            presets: ['babel-preset-es2015']
//        }))
//        .on('error', console.error.bind(console))
//        .pipe(gulp.dest('./public/servicescripts/'));
//});


gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['dashboardNewStyle']);
    gulp.watch('scripts/**/*.js',['scripts']);
});
