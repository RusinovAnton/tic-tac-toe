'use strict';

const gulp = require("gulp");
const plumber = require('gulp-plumber');
const webpack = require("webpack-stream");
const mocha = require('gulp-mocha');
const babel = require('babel-register');
const argv = require('yargs').argv;
const gutil = require('gulp-util');

const config = {
    app: {
        src: './app/index.js',
        dest: './public/assets/js/'
    },
    webpack: {
        config: './webpack.config.js'
    },
    test: {
        src: './tests/**/*.test.js'
    },
    mocha: {
        compilers: {
            js: babel
        },
        reporter: 'nyan'
    }
};

gulp.task('app', ['test'], function () {
    return gulp.src(config.app.src)
        .pipe(plumber())
        .pipe(webpack(require(config.webpack.config)))
        .pipe(gulp.dest(config.app.dest));
});

gulp.task('test', function(){
    if (!argv.notest) {
        return gulp.src(config.test.src, {read: false})
            .pipe(plumber())
            .pipe(mocha(config.mocha));
    }
    gutil.log(gutil.colors.red("Skipping test task"));
    return;
});

gulp.task('watch', ['test', 'app'], function () {
    gulp.watch('./app/**/*.js', ['app']);
});

gulp.task('default', ['app'], function () {

});
