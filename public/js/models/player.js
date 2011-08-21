/*
	Represents current client's player
	@author Justin Sermeno
*/
Forge.Player = (function(exports){
	
	var position = new THREE.Vector3(0, 0, 0);
	
	
	exports.getPosition = function() {
		var twoDPos = position.clone();
		twoDPos.y = 0;
		
		return twoDPos;
	}
	
	
	exports.update = function() {
		var camera = Forge.Shared.camera;

		var oldPosition = Forge.Math.wtorCoordinates(position);
		oldPosition.y = 0;
		
		// Update position
		position.copy( camera.position );
	
		var newPosition = Forge.Math.wtorCoordinates(position);
		newPosition.y = 0;
		
		if ( oldPosition.distanceTo( newPosition ) !== 0) {
			console.log("x: " + oldPosition.x + ", y: " + oldPosition.y + ", z: " + oldPosition.z + " ::: " + "x: " + newPosition.x + ", y: " + newPosition.y + ", z: " + newPosition.z);
			Forge.World.update();
		}
	}
	
	return exports;

})({})