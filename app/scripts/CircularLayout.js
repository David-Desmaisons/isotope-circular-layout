(function(isotopeLayoutMode, $){

function circularLayoutDefinition( LayoutMode ) {

var CircularLayout = LayoutMode.create('circular');


CircularLayout.prototype.density=10;

CircularLayout.prototype.circleNumber=2;

CircularLayout.prototype.rayValue=200;

CircularLayout.prototype.angleFirst =0;

CircularLayout.prototype.itemSize =100;



CircularLayout.prototype._resetLayout = function() {

  $.extend(this,this.isotope.options.circular);
  this.x = 0;
 // this.y = 0;
 // this.maxY = 0;
  // if (this.rayValue<this.itemSize*1.5)
  // 	this.rayValue = this.itemSize*1.5; 
  this.rayValue = Math.max(this.rayValue,this.itemSize*1.1);
  this.elementRank=0;
  this.elementNumber = this.getElementNumber();
  this.relativePosition = {circle:0,relativeRank:0,relativeRankMax:0};

  var maxpos = this.getCirclePosition(this.isotope.items.length-1),
      maxlength = this.rayValue * (1 + (maxpos.circle)*2 );
  
this.x = maxlength;
//this.y = maxlength;
 // this.elementSize=0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

CircularLayout.prototype.getElementNumber = function(){
	var sum =1,element=this.density;
	for(var i=0;i<this.circleNumber;i++){
		sum+=element;
		element*=2;
	}
	return sum;
};

CircularLayout.prototype.getCirclePosition = function(rank){

	if (rank===0)
		return {circle:0,relativeRank:0,relativeRankMax:0};

	var relative = rank-1,elementdensity=this.density;


	for(var i=0;i<this.circleNumber;i++){

		if (relative<elementdensity){
			return {circle:1+i,relativeRank:relative, relativeRankMax:elementdensity};
		}

		relative-=elementdensity;
		elementdensity*=2;
	}

	return null;
};






CircularLayout.prototype.updateRelativeCirclePosition= function(relativePosition){

	if (relativePosition===null)
		return null;

	relativePosition.relativeRank+=1;

	if (relativePosition.relativeRank<relativePosition.relativeRankMax)
		return relativePosition;

	relativePosition.circle+=1;
	if (relativePosition.circle>this.circleNumber)
		return null;

	relativePosition.relativeRank=0;
	relativePosition.relativeRankMax = (relativePosition.relativeRankMax===0)? this.density : relativePosition.relativeRankMax*2;
	return relativePosition;
};


function applytransform($element, value){
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


  var relative = this.relativePosition;
  // this.getCirclePosition(this.elementRank);

  if (relative==null){
  	return;
  }

  // var itemWidth = item.size.outerWidth + this.gutter;
  // var containerWidth = this.isotope.size.innerWidth + this.gutter;
  // if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
  //   this.x = 0;
  //   this.y = this.maxY;
  // }

  var xcenter = this.x / 2, 
     // ycenter = this.y / 2,
      xcenteritem = - this.itemSize/2,
    //  ycenteritem = - item.size.outerHeight/2,
      ray = relative.circle * this.rayValue,
      angle = (relative.relativeRankMax===0)? 0 : this.angleFirst + (Math.PI * 2 * relative.relativeRank/ relative.relativeRankMax);

      console.log('angle '+ angle);


  var position = {
    x: xcenter + ray * Math.cos(angle) + xcenteritem,
    y: xcenter + ray * Math.sin(angle) + xcenteritem
  };



  // this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  // this.x += itemWidth;

   // this.x = Math.max( this.x, position.x);
   // this.y = Math.max( this.y, position.y);

  this.elementRank+=1;
  console.log(relative);

  this.relativePosition = this.updateRelativeCirclePosition(this.relativePosition);

  var $element = $(item.element);
  $element.css({'z-index': this.elementNumber+10 -this.elementRank, height:this.itemSize, width:this.itemSize});

  console.log(position);

  return position;
};

CircularLayout.prototype._getContainerSize = function() {
  return { width:this.x, height: this.x };
};

return CircularLayout;


};

circularLayoutDefinition(isotopeLayoutMode);
}


)(window.Isotope.LayoutMode,window.jQuery);