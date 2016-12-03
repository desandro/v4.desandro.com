( function() {

  // make list items from DOM
  var sections = document.querySelectorAll('section');
  var frag = document.createDocumentFragment();
  for ( var i=0, len = sections.length; i < len; i++ ) {
    var section = sections[i];
    var titleElem = section.querySelector('.section-title');
    if ( !titleElem || !section.id ) {
      continue;
    }
    // make item
    var item = document.createElement('li');
    item.className = 'nav-item';
    var link = document.createElement('a');
    link.href = '#' + section.id;
    link.textContent = titleElem.textContent;
    item.appendChild( link );

    frag.appendChild( item );
  }

  document.querySelector('.nav-list').appendChild( frag );

})();
