/*jshint node: true */

var gulp = require('gulp');
var concat = require('gulp-concat');
// var replace = require('gulp-replace');
// var uglify = require('gulp-uglify');

// ----- content ----- //

var contentSrc = [
  'content/_head.html',
  'content/header.html',
  'content/masonry.html',
  'content/isotope.html',
  'content/flickity.html',
  'content/packery.html',
  'content/draggabilly.html',
  'content/imagesloaded.html',
  'content/logos.html',
  'content/halftones.html',
  'content/nclud-com.html',
  'content/twitter-2012.html',
  'content/beercamp-2011.html',
  'content/speaking.html',
  'content/blogs.html',
  'content/writing.html',
  'content/featured-elsewhere.html',
  'content/web-presence.html',
  'content/contact.html',
  'content/_foot.html'
];

gulp.task( 'content', function() {
  gulp.src( contentSrc )
    .pipe( concat('index.html') )
    .pipe( gulp.dest('build') );
});

// ----- css ----- //

var cssSrc = [
  'bower_components/normalize.css/normalize.css',
  'css/web-fonts.css',
  'css/base.css',
  'css/layout.css',
  'css/grid.css',
  'css/buttons.css',
  'css/header.css',
  'css/masonry.css',
  'css/isotope.css'
];

gulp.task( 'css', function() {
  gulp.src( cssSrc )
    .pipe( concat('styles.css') )
    .pipe( gulp.dest('build/css') );
});

// ----- js ----- //

var jsSrc = [
  'bower_components/get-style-property/get-style-property.js',
  'bower_components/get-size/get-size.js',
  'bower_components/matches-selector/matches-selector.js',
  'bower_components/eventEmitter/EventEmitter.js',
  'bower_components/eventie/eventie.js',
  'bower_components/doc-ready/doc-ready.js',
  'bower_components/classie/classie.js',
  // outlayer
  'bower_components/outlayer/item.js',
  'bower_components/outlayer/outlayer.js',
  // masonry
  'bower_components/masonry/masonry.js',
  // isotope
  'bower_components/isotope/js/layout-mode.js',
  'bower_components/isotope/js/item.js',
  'bower_components/isotope/js/isotope.js',
  'bower_components/isotope/js/layout-modes/fit-rows.js',
  // source
  'js/*.js'
];

gulp.task( 'js', function() {
  gulp.src( jsSrc )
    .pipe( concat('scripts.js') )
    .pipe( gulp.dest('build/js') );
});

// ----- assets ----- //

// copy assets to build/

gulp.task( 'fonts', function() {
  gulp.src( 'fonts/*.*' )
    .pipe( gulp.dest('build/fonts') );
});

gulp.task( 'img', function() {
  gulp.src( 'img/**/*.*' )
    .pipe( gulp.dest('build/img') );
});

gulp.task( 'assets', [ 'fonts', 'img' ]);

// ----- default ----- //

gulp.task( 'default', [
  'content',
  'css',
  'js',
  'assets'
] );


// ----- watch ----- //

gulp.task( 'watch', function() {
  gulp.watch( 'content/*.*', [ 'content' ] );
  gulp.watch( 'css/*.css', [ 'css' ] );
  gulp.watch( 'js/*.js', [ 'js' ] );
});
