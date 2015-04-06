(function(isotopeLayoutMode, $){
'use strict';

function circularLayoutDefinition( LayoutMode ) {

var CircularLayout = LayoutMode.create('circular');

CircularLayout.prototype.defaultOptions ={
  density:10,
  circleNumber:2,
  rayValue:200,
  angleFirst:0,
  clockWise:true,
  itemSize:100,
  scale : function(circle){ return circle===0 ? 1.1 : Math.pow(0.9,circle);} 
};

CircularLayout.prototype._resetLayout = function() {

  this.CompleteOptions = $.extend({},this.defaultOptions,this.options);
  this.CompleteOptions.rayValue = Math.max(this.CompleteOptions.rayValue,this.CompleteOptions.itemSize*1.1);
  this.elementRank=0;
  this.elementNumber = this.isotope.items.length;
  this.relativePosition = {circle:0,relativeRank:0,relativeRankMax:0};

  var maxpos = this.getCirclePosition(this.elementNumber-1),
      circlenumber = Math.min(maxpos.circle, this.CompleteOptions.circleNumber), 
      maxlength = this.options.rayValue * (1 + circlenumber*2 );
  
  this.x = maxlength;
};

CircularLayout.prototype.getCirclePosition = function(rank){

	if (rank===0){
		return {circle:0,relativeRank:0,relativeRankMax:0};
  }

	var relative = rank-1,elementdensity=this.CompleteOptions.density;

	for(var i=0;;i++){

		if (relative<elementdensity){
			return {circle:1+i,relativeRank:relative, relativeRankMax:elementdensity};
		}

		relative-=elementdensity;
		elementdensity*=2;
	}

	//return null;
};


CircularLayout.prototype.updateRelativeCirclePosition= function(relativePosition){

	if (relativePosition===null){
		return null;
  }

	relativePosition.relativeRank+=1;

	if (relativePosition.relativeRank<relativePosition.relativeRankMax){
		return relativePosition;
  }

	relativePosition.circle+=1;
	if (relativePosition.circle>=this.options.circleNumber){
		return null;
  }

	relativePosition.relativeRank=0;
	relativePosition.relativeRankMax = (relativePosition.relativeRankMax===0)? this.CompleteOptions.density : relativePosition.relativeRankMax*2;
	return relativePosition;
};


function applyTransform($element, value){
	$element.css({
            '-webkit-transform': value,
            '-moz-transform': value,
            '-ms-transform': value,
            '-o-transform': value,
            'transform': value
        });
}


CircularLayout.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();

 var $element = $(item.element),
    relative = this.relativePosition;

  if (relative===null){
    $element.hide();
  	return {x:0,y:0};
  }

  $element.show();

  var xcenter = this.x / 2, 
      xcenteritem = - this.CompleteOptions.itemSize/2,
      ray = relative.circle * this.CompleteOptions.rayValue,
      angle = (relative.relativeRankMax===0)? 0 : this.CompleteOptions.angleFirst + (Math.PI * 2 * relative.relativeRank/ relative.relativeRankMax);

  var position = {
    x: xcenter + ray * Math.cos(angle) + xcenteritem,
    y: xcenter + ray * Math.sin(angle) + xcenteritem
  };
 
  $element.css({'z-index': this.elementNumber+10 -this.elementRank, height:this.CompleteOptions.itemSize, width:this.CompleteOptions.itemSize});
  var scale =  this.CompleteOptions.scale(relative.circle);
  applyTransform($element,'scale( '+scale +' )');


  this.elementRank+=1;
  this.relativePosition = this.updateRelativeCirclePosition(this.relativePosition);

  return position;
};

CircularLayout.prototype._getContainerSize = function() {
  return { width:this.x, height: this.x };
};

return CircularLayout;
}

circularLayoutDefinition(isotopeLayoutMode);
}


)(window.Isotope.LayoutMode,window.jQuery);