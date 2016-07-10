( function( window ) {
'use strict';

var utils = window.fizzyUIUtils;

// -------------------------- GifPlayer -------------------------- //

function GifPlayer( elem ) {
  this.element = elem;
  this.isPlaying = false;
  this.isGifLoaded = false;
  this.img = elem.querySelector('.gif-player__img');
  this.posterImgSrc = this.img.getAttribute('data-src');
  this.gifSrc = this.img.getAttribute('data-gif');
  elem.addEventListener( 'click', this );
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
  this.element.classList.remove('is-stopped');
  this.element.classList.add('is-loading');
  // load gif
  var proxyGifImg = new Image();
  proxyGifImg.addEventListener( 'load', this );
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
  if ( this.isPlaying ) {
    this.stopLoading();
    this.displayGif();
  }
};

GifPlayer.prototype.stopLoading = function() {
  if ( !this.isGifLoading ) {
    return;
  }
  this.element.removeChild( this.loaderSpinner );
  this.element.classList.remove('is-loading');
  delete this.isGifLoading;
};

GifPlayer.prototype.displayGif = function() {
  this.element.classList.remove('is-stopped');
  this.element.classList.add('is-playing');
  this.img.src = this.gifSrc;
};

GifPlayer.prototype.stop = function() {
  if ( !this.isPlaying ) {
    return;
  }
  this.stopLoading();
  
  this.element.classList.remove('is-playing');
  this.element.classList.add('is-stopped');
  this.img.src = this.posterImgSrc;
  this.isPlaying = false;
};

// ----- init ----- //

var gifPlayerElems = document.querySelectorAll('.js-gif-player');
for ( var i=0, len = gifPlayerElems.length; i < len; i++ ) {
  new GifPlayer( gifPlayerElems[i] );
}

})( window );
