/*
	Model representing a single chunk existing someplace in 3D
	space
	@author Justin Sermeno
*/
Forge.Chunk = (function(){
	
	function Chunk(spec) {
		
		this.position = new THREE.Vector3(spec.x || 0, spec.y || 0, spec.z || 0);
		this.data = spec.data;
		
		this.isDirty = true; // dirty on creation by default
		this.renderObject = undefined;
	}
	
	
	Chunk.prototype.getDistanceFromPlayer = function() {
		var playerPos = Forge.Player.getPosition();
		
		return playerPos.distanceTo( this.position );
	};
	
	
	Chunk.prototype.getRenderObject = function() {
		return this.renderObject;
	};
	
	
	Chunk.prototype.setRenderObject = function(rendered) {
		this.renderObject = rendered;
	};
	
	
	Chunk.prototype.getPosition = function() {
		return this.position;
	};


	Chunk.prototype.setDirty = function() {
		this.isDirty = true;
	};
		
	
	Chunk.prototype.clean = function() {
		this.isDirty = false;
	};
	
	
	Chunk.prototype.getData = function(x, y, z) {
		var index = z + ( x  * Forge.Config.chunk_size + y ) * Forge.Config.chunk_size;
		
		return this.data[index];
	};
	
	
	return Chunk;
	
})();