docReady( function() {

  var gridElem = document.querySelector('.packery-demo');
  
  var pckry = new Packery( gridElem, {
    itemSelector: '.packery-demo__item',
    columnWidth: '.packery-demo__grid-sizer',
    rowHeight: '.packery-demo__grid-sizer',
    gutter: '.packery-demo__gutter-sizer'
  });

  var dragElem = gridElem.querySelector('.packery-demo__item--draggable');
  var draggie = new Draggabilly( dragElem );
  pckry.bindDraggabillyEvents( draggie );

});
