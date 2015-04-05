(function(Isotope){
	'use strict';

	var container = document.querySelector('#container');
// init
new Isotope( container, {
  // options
  itemSelector: '.item',
  layoutMode: 'circular',
  circular :{
  	density: 6,
  	angleFirst:Math.PI/2,
  	rayValue: 100,
  	itemSize: 100,
  	scale : function(circle){return circle===0 ? 1.5 : Math.pow(0.5,circle-1);}
  }});
})(window.Isotope);