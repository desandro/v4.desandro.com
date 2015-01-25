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
  'content/blogs.html',
  'content/web-presence.html',
  'content/halftones.html',
  'content/nclud-com.html',
  'content/twitter-2012.html',
  'content/beercamp-2011.html',
  'content/speaking.html',
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
  'css/header.css',
  'css/masonry.css'
];

gulp.task( 'css', function() {
  gulp.src( cssSrc )
    .pipe( concat('styles.css') )
    .pipe( gulp.dest('build/css') );
});

// ----- assets ----- //

// copy assets to build/

gulp.task( 'fonts', function() {
  gulp.src( 'fonts/*.*' )
    .pipe( gulp.dest('build/fonts') );
});

gulp.task( 'img', function() {
  gulp.src( 'img/*.*' )
    .pipe( gulp.dest('build/img') );
});

gulp.task( 'assets', [ 'fonts', 'img' ]);

// ----- default ----- //

gulp.task( 'default', [
  'content',
  'css',
  'assets'
] );


// ----- watch ----- //

gulp.task( 'watch', function() {
  gulp.watch( 'content/*.*', [ 'content' ] );
  gulp.watch( 'css/*.css', [ 'css' ] );
});
