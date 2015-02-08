/*jshint node: true, undef: true, unused: true */

var gulp = require('gulp');
var concat = require('gulp-concat');
var build = require('gulp-build');
var glob = require('glob');
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

// ----- css ----- //

var cssSrc = [
  'bower_components/normalize.css/normalize.css',
  'css/web-fonts.css',
  'css/base.css',
  'css/grid.css',
  'css/buttons.css',
  'css/header.css',
  'css/masonry.css',
  'css/isotope.css',
  'css/packery.css'
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
  // draggabilly
  'bower_components/draggabilly/draggabilly.js',
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

// ----- content ----- //

var contentSrc = [
  'content/_head.mustache',
  'content/header.html',
  'content/masonry.html',
  'content/isotope.html',
  'content/flickity.html',
  'content/packery.html',
  'content/draggabilly.html',
  'content/imagesloaded.html',
  'content/logos.html',
  'content/portraits.html',
  'content/nclud-com.html',
  'content/twitter-2012.html',
  'content/beercamp-2011.html',
  'content/speaking.html',
  'content/blogs.html',
  'content/writing.html',
  'content/featured-elsewhere.html',
  'content/web-presence.html',
  'content/contact.html',
  'content/_foot.mustache'
];

function buildContent( dataOptions ) {
  // var pageTemplate = fs.readFileSync( pageTemplateSrc, 'utf8' );
  // gulp task
  return function() {
    var data = extend( dataOptions || {}, {
      css_paths: getGlobPaths( cssSrc ),
      js_paths: getGlobPaths( jsSrc )
    });

    var buildOptions = {
      // layout: pageTemplate,
      // partials: partials
    };

    gulp.src( contentSrc )
      .pipe( build( data, buildOptions ) )
      .pipe( concat('index.html') )
      .pipe( gulp.dest('build') );
  };
}

gulp.task( 'content', buildContent() );

gulp.task( 'content-dev', buildContent({ is_dev: true }) );

// ----- default ----- //

gulp.task( 'default', [
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
});
