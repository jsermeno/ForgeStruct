/*
	Represents current client's player
	@author Justin Sermeno
*/
Forge.Player = (function(exports){
	
	var position = new THREE.Vector3(0, 0, 0);
	
	
    exports.getRegion = function() {
        var region =  Forge.Math.wtorCoordinates( position );
        region.y = 0;
    
        return region;
    };


	exports.getPosition = function() {
		var twoDPos = position.clone();
		twoDPos.y = 0;
		
		return twoDPos;
	};
	
	
	exports.update = function() {
		var camera = Forge.Shared.camera;

    position.copy( camera.position );
    //console.log(position);
    
	};

	
	return exports;

})({})
