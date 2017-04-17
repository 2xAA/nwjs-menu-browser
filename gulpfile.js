var gulp = require('gulp');
var path = require('path');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');

webpackConfig.entry = {
  menu: './src/index.js'
};

webpackConfig.output.filename = 'nwjs-menu-browser.js';

webpackConfig.output.library = 'nwjsMenuBrowser';

gulp.task('copy-css', function() {
  return gulp.src('./nwjs-menu-browser.css')
    .pipe(gulp.dest(path.resolve(__dirname, 'dist')));
});

gulp.task('build-js', function() {
  return gulp.src('./src')
    .pipe(
      webpackStream(
        require('./webpack.config.js'),
        webpack // pass webpack for webpack2
      )
    )
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['copy-css', 'build-js']);