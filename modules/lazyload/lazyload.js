( function( window ) {
'use strict';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var lazyLoaders = [];

var winHeight;

// -------------------------- LazyLoader -------------------------- //

function LazyLoader( element ) {
  this.element = element;
  this.isLazy = true;
  this.isImg = this.element.nodeName == 'IMG';
  if ( this.isImg ) {
    this.setPlaceholder();
  }
}

LazyLoader.prototype.getRatio = function() {
  this.ratio = 1; // default is 1x1
  var ratioAttr = this.element.getAttribute('data-lazy');
  if ( ratioAttr ) {
    var ratioParts = ratioAttr.split('x');
    this.ratio = parseInt( ratioParts[0], 10 ) / parseInt( ratioParts[1], 10 );
  }
};

LazyLoader.prototype.setPlaceholder = function() {
  this.getRatio();
  var w = canvas.width = 100;
  var h = canvas.height = 100 / this.ratio;
  ctx.fillStyle = '#EEE';
  ctx.fillRect( 0, 0, w, h );
  this.element.src = canvas.toDataURL();
};

LazyLoader.prototype.getPosition = function() {
  var rect = this.element.getBoundingClientRect();
  this.top = rect.top + window.scrollY;
  this.bottom = this.top + this.element.offsetHeight;
};

LazyLoader.prototype.check = function() {
  var scrollY = window.scrollY;
  var activeTop = scrollY - winHeight * 1.5;
  var activeBottom = scrollY + winHeight * 3;
  var isInOverlap = this.top < activeBottom && this.bottom > activeTop;
  if ( isInOverlap ) {
    this.load();
  }
};

LazyLoader.prototype.load = function() {
  if ( !this.isLazy ) {
    return;
  }
  this.element.src = this.element.getAttribute('data-src');
  this.isLazy = false;
};

// --------------------------  -------------------------- //

function throttle( fn, delay ) {
  var wait = false;
  return function () {
    if ( wait ) {
      return;
    }
    fn();
    wait = true;
    setTimeout( function (){
      wait = false;
      fn();
    }, delay || 100 );
  };
}

function loadLazyLoaders() {
  // stop listening if no more to load
  if ( !lazyLoaders.length ) {
    window.removeEventListener( 'scroll', onThrottledScroll, false );
    return;
  }

  var nextLazyLoaders = [];
  // check lazy loaders
  // console.log('scroll', lazyLoaders.length );
  for ( var i=0, len = lazyLoaders.length; i < len; i++ ) {
    var lazyLoader = lazyLoaders[i];
    lazyLoader.check();
    // only keep loaders that are still lazy
    if ( lazyLoader.isLazy ) {
      nextLazyLoaders.push( lazyLoader );
    }
  }
  lazyLoaders = nextLazyLoaders;
}

var onThrottledScroll = throttle( loadLazyLoaders, 200 );

function getLazyLoadersPositions() {
  for ( var i=0, len = lazyLoaders.length; i < len; i++ ) {
    lazyLoaders[i].getPosition();
  }
}

// -------------------------- resize -------------------------- //

function debounce( fn, threshold ) {
  var timeout;
  return function debounced() {
    clearTimeout( timeout );

    var _this = this;
    var args = arguments;
    function delayed() {
      fn.apply( _this, args );
    }

    timeout = setTimeout( delayed, threshold || 100 );
  };
}

function onResize() {
  winHeight = window.innerHeight;
  getLazyLoadersPositions();
  loadLazyLoaders();
}

// -------------------------- docReady -------------------------- //

winHeight = window.innerHeight;

var lazyLoadImgs = document.querySelectorAll('img[data-lazy], iframe[data-lazy]');
var lazyLoader;
for ( var i=0, len = lazyLoadImgs.length; i < len; i++ ) {
  var img = lazyLoadImgs[i];
  lazyLoader = new LazyLoader( img );
  lazyLoaders.push( lazyLoader );
}


// do async for other stuff to be setup
setTimeout( function() {
  getLazyLoadersPositions();

  loadLazyLoaders();
  window.addEventListener( 'scroll', onThrottledScroll, false );

  // need other images to load
  var legitImgs = document.querySelectorAll('.header img, .masonry img');
  imagesLoaded( legitImgs, onResize );

  // get positions on window resize
  window.addEventListener( 'resize', debounce( onResize ) );

});

})( window );
