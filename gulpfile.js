/*jshint node: true, undef: true, unused: true */

var gulp = require('gulp');
var concat = require('gulp-concat');
var build = require('gulp-build');
var glob = require('glob');
// var fs = require('fs');
var through2 = require('through2');
var path = require('path');
// var replace = require('gulp-replace');
// var uglify = require('gulp-uglify');

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

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
  'css/web-fonts.css',
  'css/base.css',
  'css/modules/*.css'
];

gulp.task( 'css', function() {
  gulp.src( cssSrc )
    .pipe( concat('styles.css') )
    .pipe( gulp.dest('build/css') );
});

// ----- js ----- //

var uglify = require('gulp-uglify');

var jsSrc = [
  'bower_components/get-style-property/get-style-property.js',
  'bower_components/get-size/get-size.js',
  'bower_components/matches-selector/matches-selector.js',
  'bower_components/eventEmitter/EventEmitter.js',
  'bower_components/eventie/eventie.js',
  'bower_components/doc-ready/doc-ready.js',
  'bower_components/classie/classie.js',
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
  'bower_components/flickity/js/animate.js',
  'bower_components/flickity/js/flickity.js',
  'bower_components/flickity/js/prev-next-button.js',
  'bower_components/flickity/js/page-dots.js',
  'bower_components/flickity/js/drag.js',
  // source
  'js/*.js'
];

gulp.task( 'js', function() {
  gulp.src( jsSrc )
    .pipe( uglify() )
    .pipe( concat('scripts.js') )
    .pipe( gulp.dest('build/js') );
});

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

// ----- data ----- //

// add all data/*.json to siteData
// file.json => siteData.file: {json}
var dataSrc = 'data/*.json';
var siteData = {};

gulp.task( 'data', function() {
  var addJsonData = through2.obj( function( file, enc, callback ) {
    var basename = path.basename( file.path, path.extname( file.path ) );
    siteData[ basename ] = JSON.parse( file.contents.toString() );
    this.push( file );
    callback();
  });

  return gulp.src( dataSrc )
    .pipe( addJsonData );
});

// ----- partials ----- //

var partialsSrc = 'partials/*.mustache';
var partials = [];

gulp.task( 'partials', function() {
  var addPartial = through2.obj( function( file, enc, callback ) {
    partials.push({
      name: path.basename( file.path, path.extname( file.path ) ),
      tpl: file.contents.toString()
    });
    this.push( file );
    callback();
  });

  return gulp.src( partialsSrc )
    .pipe( addPartial );
});

// ----- content ----- //

var contentSrc = [
  'content/_head.mustache',
  'content/header.mustache',
  'content/nav.mustache',
  'content/masonry.html',
  'content/isotope.mustache',
  'content/flickity.mustache',
  'content/packery.html',
  'content/other-projects.html',
  'content/logos.mustache',
  'content/portraits.mustache',
  'content/codepen.mustache',
  'content/nclud-com.mustache',
  'content/twitter-2012.html',
  'content/beercamp-2011.mustache',
  'content/speaking.html',
  'content/blogs.html',
  'content/writing.html',
  'content/featured-elsewhere.html',
  'content/web-presence.html',
  'content/contact.html',
  'content/_foot.mustache'
];

function buildContent( dataOptions ) {
  // gulp task
  return function() {
    // var pageTemplate = fs.readFileSync( pageTemplateSrc, 'utf8' );

    dataOptions = extend( dataOptions || {}, siteData );

    var data = extend( dataOptions || {}, {
      css_paths: getGlobPaths( cssSrc ),
      js_paths: getGlobPaths( jsSrc )
    });

    var buildOptions = {
      // layout: pageTemplate,
      partials: partials
    };

    gulp.src( contentSrc )
      .pipe( build( data, buildOptions ) )
      .pipe( concat('index.html') )
      .pipe( gulp.dest('build') );
  };
}

var contentDepTasks = [ 'partials', 'data' ];

gulp.task( 'content', contentDepTasks, buildContent() );

gulp.task( 'content-dev', contentDepTasks, buildContent({ is_dev: true }) );

// ----- default ----- //

gulp.task( 'default', [
  'hint',
  'content',
  'css',
  'js',
  'assets'
] );

// ----- watch ----- //

gulp.task( 'watch', [ 'default' ], function() {
  gulp.watch( 'content/*.*', [ 'content' ] );
  gulp.watch( 'css/*.css', [ 'css' ] );
  gulp.watch( 'js/*.js', [ 'js' ] );
  gulp.watch( dataSrc, [ 'data' ] );
});

gulp.task( 'watch-dev', [ 'assets', 'content-dev' ], function() {
  gulp.watch( 'content/*.*', [ 'content-dev' ] );
  gulp.watch( dataSrc, [ 'content-dev' ] );
  gulp.watch( imgSrc, [ 'img' ] );
});
