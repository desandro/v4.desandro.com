docReady( function() {

  var contactEmailLink = document.querySelector('.contact__email-link');

  function onEmailLinkClick( event ) {
    event.preventDefault();
    var email = [ 'contact', '@', 'desandro', '.com' ].join('');
    contactEmailLink.textContent = email;
    contactEmailLink.href = 'mailto:' + email;
    contactEmailLink.removeEventListener( 'click', onEmailLinkClick, false );
  }

  contactEmailLink.addEventListener( 'click', onEmailLinkClick, false );

});
