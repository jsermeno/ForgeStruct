var BlockUtils = (function(exports){
	
	var chunk_size = 32;
	var block_size = 100;
	
	/*
		World to region coordinates
		@pos THREE.Vector3 of world coordinates
	*/
	exports.wtorCoordinates = function(pos) {
			
		var rX = pos.x >= 0 ? ~~(pos.x / (chunk_size * block_size)) : ~~((pos.x + 1) / (chunk_size * block_size)) - 1;
		var rY = pos.y >= 0 ? ~~(pos.y / (chunk_size * block_size)) : ~~((pos.y + 1) / (chunk_size * block_size)) - 1;
		var rZ = pos.z >= 0 ? ~~(pos.z / (chunk_size * block_size)) : ~~((pos.z + 1) / (chunk_size * block_size)) - 1;
		
		return {x: rX, y: rY, z: rZ};
	}
	
	return exports;
	
})({});


module.exports = BlockUtils;