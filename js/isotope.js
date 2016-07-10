( function() {

  var iso = new Isotope( '.isotope-demo', {
    itemSelector: '.isotope-demo__item',
    layoutMode: 'fitRows',
    stagger: 30,
    transitionDuration: '0.3s',
    getSortData: {
      letter: '.isotope-demo__item__letter',
      number: '.isotope-demo__item__number parseInt'
    }
  });

  var filtersGroup = document.querySelector('.button-group--isotope-filters');
  filtersGroup.addEventListener( 'click', function( event ) {
    var filter = event.target.getAttribute('data-isotope-filter');
    if ( !filter ) {
      return;
    }
    iso.arrange({ filter: filter });
    selectButton( event.target );
  });

  var sortsGroup = document.querySelector('.button-group--isotope-sorts');
  sortsGroup.addEventListener( 'click', function( event ) {
    var sort = event.target.getAttribute('data-isotope-sort');
    if ( !sort ) {
      return;
    }
    iso.arrange({ sortBy: sort });
    selectButton( event.target );
  });

  function selectButton( button ) {
    var selectedButton = button.parentNode.querySelector('.is-selected');
    selectedButton.classList.remove('is-selected');
    button.classList.add('is-selected');
  }

})();
