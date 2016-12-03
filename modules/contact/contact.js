( function() {

  var emailElem = document.querySelector('.contact__email');

  var gateLink = emailElem.querySelector('.contact__email__piece--gate a');
  var addressLink = emailElem.querySelector('.contact__email__piece--address a');

  function onGateClick( event ) {
    event.preventDefault();
    var email = [ 'contact', '@', 'desandro', '.com' ].join('');
    addressLink.textContent = email;
    addressLink.href = 'mailto:' + email;
    emailElem.className += ' is-address-visible';
    gateLink.removeEventListener( 'click', onGateClick, false );
  }

  gateLink.addEventListener( 'click', onGateClick, false );

})();
