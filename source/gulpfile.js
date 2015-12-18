'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var html5Lint = require('gulp-html5-lint');
var favicons = require("gulp-favicons");

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = '../output_dev';
var LIVERELOAD_PORT = 35729;

function startExpress() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);
}

var lr;
function startLivereload() {
    lr = require('tiny-lr')();
    lr.listen(LIVERELOAD_PORT);
}

function notifyLivereload(event) {

    // `gulp.watch()` events provide an absolute path
    // so we need to make it relative to the server root
    var fileName = require('path').relative(EXPRESS_ROOT, event.path);

    lr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('default', function() {

});

gulp.task('sass', function() {
    gulp.src('./sass/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/*.scss', ['sass']);
});

gulp.task('html5-lint', function() {
    return gulp.src('../output_dev/index.html')
        .pipe(html5Lint());
});

gulp.task('favicon', function() {
    gulp.src("images/code.png").pipe(favicons({
        appName: "mikebell.io",
        appDescription: "Blog & Stuff",
        developerName: "Mike Bell",
        developerURL: "http://mikebell.io",
        background: "#ffffff",
        path: "",
        url: "http://mikebell.io/",
        display: "standalone",
        orientation: "portrait",
        version: 1.0,
        logging: true,
        online: false,
        html: "_layouts/default.html"
    })).pipe(gulp.dest("./"));
});

gulp.task('server', function() {
    startExpress();
    startLivereload();
    gulp.watch('*.html', notifyLivereload);
    gulp.watch('*.css', notifyLivereload);
});