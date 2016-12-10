/*jshint node: true, undef: true, unused: true */

var gulp = require('gulp');
var concat = require('gulp-concat');
var glob = require('glob');
var path = require('path');

// -----  ----- //

var data = {
  is_dev: process.argv[2] == 'dev',
};

// ----- getGlobPaths ----- //

/**
 * takes glob src and returns expanded paths
 * @param {Array} src
 * @returns {Array} paths
 */
function getGlobPaths( src ) {
  // copy src
  var paths = src.slice(0);
  // replace all glob paths with expanded paths
  src.forEach( function( path, i ) {
    if ( glob.hasMagic( path ) ) {
      var files = glob.sync( path );
      // replace glob with paths
      paths.splice.apply( paths, [ i, 1 ].concat( files ) );
    }
  });
  return paths;
}

// ----- hint ----- //

var jshint = require('gulp-jshint');
var jsonlint = require('gulp-json-lint');

gulp.task( 'hint-js', function() {
  return gulp.src('js/**/*.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

gulp.task( 'hint-task', function() {
  return gulp.src('gulpfile.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('default') );
});

var jsonlint = require('gulp-json-lint');

gulp.task( 'jsonlint', function() {
  return gulp.src( [ '*.json', 'data/*.json' ] )
    .pipe( jsonlint() )
    .pipe( jsonlint.report('verbose') );
});

gulp.task( 'hint', [ 'hint-js', 'hint-task', 'jsonlint' ]);

// ----- css ----- //

var cssSrc = [
  'bower_components/normalize.css/normalize.css',
  'bower_components/flickity/css/flickity.css',
  'css/*.css',
  'modules/*/*.css',
];

gulp.task( 'css', function() {
  gulp.src( cssSrc )
    .pipe( concat('styles.css') )
    .pipe( gulp.dest('build/css') );
});

data.css_paths = getGlobPaths( cssSrc );

// ----- js ----- //

var uglify = require('gulp-uglify');

var jsSrc = [
  'bower_components/get-size/get-size.js',
  'bower_components/desandro-matches-selector/matches-selector.js',
  'bower_components/ev-emitter/ev-emitter.js',
  'bower_components/fizzy-ui-utils/utils.js',
  // draggabilly
  'bower_components/unipointer/unipointer.js',
  'bower_components/unidragger/unidragger.js',
  'bower_components/draggabilly/draggabilly.js',
  // imagesloaded
  'bower_components/imagesloaded/imagesloaded.js',
  // outlayer
  'bower_components/outlayer/item.js',
  'bower_components/outlayer/outlayer.js',
  // masonry
  'bower_components/masonry/masonry.js',
  // packery
  'bower_components/packery/js/rect.js',
  'bower_components/packery/js/packer.js',
  'bower_components/packery/js/item.js',
  'bower_components/packery/js/packery.js',
  // isotope
  'bower_components/isotope/js/layout-mode.js',
  'bower_components/isotope/js/item.js',
  'bower_components/isotope/js/isotope.js',
  'bower_components/isotope/js/layout-modes/fit-rows.js',
  // flickity deps
  'bower_components/tap-listener/tap-listener.js',
  // flickity
  'bower_components/flickity/js/cell.js',
  'bower_components/flickity/js/slide.js',
  'bower_components/flickity/js/animate.js',
  'bower_components/flickity/js/flickity.js',
  'bower_components/flickity/js/prev-next-button.js',
  'bower_components/flickity/js/page-dots.js',
  'bower_components/flickity/js/drag.js',
  // modules
  'modules/*/*.js'
];

gulp.task( 'js', function() {
  gulp.src( jsSrc )
    .pipe( uglify() )
    .pipe( concat('scripts.js') )
    .pipe( gulp.dest('build/js') );
});

data.js_paths = getGlobPaths( jsSrc );

// ----- assets ----- //

// copy assets to build/

gulp.task( 'fonts', function() {
  return gulp.src( 'fonts/*.*' )
    .pipe( gulp.dest('build/fonts') );
});

var imgSrc = 'img/**/*.*';
gulp.task( 'img', function() {
  return gulp.src( imgSrc )
    .pipe( gulp.dest('build/img') );
});

gulp.task( 'extra-assets', function() {
  return gulp.src( 'assets/*.*' )
    .pipe( gulp.dest('build') );
});

gulp.task( 'assets', [ 'fonts', 'img', 'extra-assets' ]);

// ----- content ----- //

var hb = require('gulp-hb');
var rename = require('gulp-rename');

var contentSrc = 'content/*.hbs';
var partialsSrc = 'modules/*/*.hbs';
var dataSrc = 'data/*.json';

gulp.task( 'content', function() {

  return gulp.src( 'content/*.hbs' )
    .pipe( hb()
      .partials( partialsSrc, {
        parsePartialName: function( options, file ) {
          return path.basename( file.path, '.hbs' );
        }
      } )
      .data( dataSrc )
      .data( data )
    )
    .pipe( rename({ extname: '.html' }) )
    .pipe( gulp.dest('build') );

});

// ----- default ----- //

gulp.task( 'default', [
  'hint',
  'content',
  'css',
  'js',
  'assets'
] );

// ----- watch ----- //

gulp.task( 'dev', [ 'default' ], function() {
  gulp.watch( contentSrc, [ 'content' ] );
  gulp.watch( partialsSrc, [ 'content' ] );
  gulp.watch( dataSrc, [ 'content' ] );
  gulp.watch( 'css/*.css', [ 'css' ] );
  gulp.watch( 'js/*.js', [ 'js' ] );
});
