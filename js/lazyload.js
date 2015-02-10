( function( window ) {
'use strict';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var lazyLoaders = [];

var winHeight;

// -------------------------- LazyLoader -------------------------- //

function LazyLoader( img ) {
  this.img = img;
  this.isLazy = true;
  this.setPlaceholder();
}

LazyLoader.prototype.getRatio = function() {
  this.ratio = 1; // default is 1
  var ratioAttr = this.img.getAttribute('data-lazy');
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
  this.img.src = canvas.toDataURL();
};

LazyLoader.prototype.getPosition = function() {
  var rect = this.img.getBoundingClientRect();
  this.top = rect.top + window.scrollY;
  this.bottom = this.top + this.img.offsetHeight;
};

LazyLoader.prototype.check = function() {
  var scrollY = window.scrollY;
  var activeTop = scrollY - winHeight;
  var activeBottom = scrollY + winHeight * 2;
  var isInOverlap = this.top < activeBottom && this.bottom > activeTop;
  if ( isInOverlap ) {
    this.load();
  }
};

LazyLoader.prototype.load = function() {
  if ( !this.isLazy ) {
    return;
  }
  this.img.src = this.img.getAttribute('data-src');
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

function onScroll() {
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

var onThrottledScroll = throttle( onScroll, 200 );

function getLazyLoadersPositions() {
  for ( var i=0, len = lazyLoaders.length; i < len; i++ ) {
    lazyLoaders[i].getPosition();
  }
}

// -------------------------- docReady -------------------------- //

docReady( function() {
  winHeight = window.innerHeight;

  var lazyLoadImgs = document.querySelectorAll('img[data-lazy]');
  var lazyLoader;
  for ( var i=0, len = lazyLoadImgs.length; i < len; i++ ) {
    var img = lazyLoadImgs[i];
    lazyLoader = new LazyLoader( img );
    lazyLoaders.push( lazyLoader );
  }

  // do async for other stuff to be setup
  setTimeout( function() {
    getLazyLoadersPositions();

    onScroll();
    window.addEventListener( 'scroll', onThrottledScroll, false );

    // need other images to load
    var legitImgs = document.querySelectorAll('.header img, .masonry img');
    imagesLoaded( legitImgs, function() {
      getLazyLoadersPositions();
      onScroll();
    });

  });

});

})( window );
