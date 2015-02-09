( function( window ) {
'use strict';

var utils = window.fizzyUIUtils;

// -------------------------- GifPlayer -------------------------- //

function GifPlayer( elem ) {
  this.element = elem;
  this.isPlaying = false;
  this.isGifLoaded = false;
  this.img = elem.querySelector('.gif-player__img');
  this.posterImgSrc = this.img.src;
  this.gifSrc = this.img.getAttribute('data-gif');
  eventie.bind( elem, 'click', this );
}

GifPlayer.prototype.handleEvent = utils.handleEvent;

GifPlayer.prototype.onclick = function() {
  this.toggle();
};

GifPlayer.prototype.toggle = function() {
  if ( this.isPlaying ) {
    this.stop();
  } else {
    this.play();
  }
};

GifPlayer.prototype.play = function() {
  if ( this.isPlaying ) {
    return;
  }
  this.isPlaying = true;

  if ( this.isGifLoaded ) {
    this.displayGif();
  } else {
    this.loadGif();
  }
};

GifPlayer.prototype.loadGif = function() {
  // only load once
  if ( this.isGifLoading ) {
    return;
  }
  // flags
  this.isGifLoading = true;
  // classes
  classie.remove( this.element, 'is-stopped' );
  classie.add( this.element, 'is-loading' );
  // load gif
  var proxyGifImg = new Image();
  eventie.bind( proxyGifImg, 'load', this );
  proxyGifImg.src = this.gifSrc;
  // add loader spinner
  this.loaderSpinner = new Image();
  this.loaderSpinner.className = 'loader-spinner';
  this.loaderSpinner.src = 'img/loader-spinner.png';
  this.element.appendChild( this.loaderSpinner );
};

GifPlayer.prototype.onload = function() {
  // flags
  this.isGifLoaded = true;
  // display gif
  var _this = this;
  setTimeout( function() {
  
    if ( _this.isPlaying ) {
      _this.stopLoading();
      _this.displayGif();
    }
  }, 500 )
  
};

GifPlayer.prototype.stopLoading = function() {
  if ( !this.isGifLoading ) {
    return;
  }
  this.element.removeChild( this.loaderSpinner );
  classie.remove( this.element, 'is-loading' );
  delete this.isGifLoading;
};

GifPlayer.prototype.displayGif = function() {
  classie.remove( this.element, 'is-stopped' );
  classie.add( this.element, 'is-playing' );
  this.img.src = this.gifSrc;
};

GifPlayer.prototype.stop = function() {
  if ( !this.isPlaying ) {
    return;
  }
  this.stopLoading();
  
  classie.remove( this.element, 'is-playing' );
  classie.add( this.element, 'is-stopped' );
  this.img.src = this.posterImgSrc;
  this.isPlaying = false;
};

// -----  ----- //

docReady( function() {
  var gifPlayerElems = document.querySelectorAll('.js-gif-player');
  for ( var i=0, len = gifPlayerElems.length; i < len; i++ ) {
    new GifPlayer( gifPlayerElems[i] );
  }
});

})( window );
