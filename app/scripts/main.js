var container = document.querySelector('#container');
// init
var iso = new Isotope( container, {
  // options
  itemSelector: '.item',
  layoutMode: 'circular',
  circular :{
  	density: 7,
  	rayValue: 100,
  	itemSize: 100
  }
});