/*
	Represents the world space and landscape
	@author Justin Sermeno
*/
Forge.World = (function(exports){
	
	var visible = new Forge.OrderedMap();
	var started = false;
	
	/*
		Updates visible blocks and initiates rendering afterwards
	*/
	exports.update = function() {
		
		// Update visible
		console.log("updating visible...");
		Forge.Cache.updateVisible(visible, updateRendered);
				
	}
	
	
	/*
		Updates rendered chunks
	*/
	function updateRendered(data, toRemove) {
		var i, len;
		
		var scene = Forge.Shared.scene;
		var renderObject;
		
		// Remove rendered objects from scene if they are no longer visible
		//console.log("updating rendered...");
		console.log("new visible: " + data.size());
		console.log("to remove: " + toRemove.size());
		console.time("rendering");
		for ( i = 0, len = toRemove.size(); i < len; i++ ) {
			renderObject = toRemove.getIndex(i).getRenderObject();
			
			if ( renderObject !== undefined ) {
				scene.removeChild( renderObject );
			}
		}
		
		
		toRemove = null;
		visible = data;
		
		
		// Render new chunks
		console.log("rendering new chunks...");
		var
			chunk,
			i = 0,
			len = data.size();
	
		setTimeout(renderWorld, 10);
		
		// inner function to run asynchronously
		function renderWorld(renderData) {
			
			if (i >= len) {
				if ( !started ) {
					Forge.Game.start();
					started = true;
				}
				console.timeEnd("rendering");
				return;
			}
			
			chunk = data.getIndex(i++);
			if ( chunk === undefined ) { console.log("couldn't find chunk at index " + (i - 1)); console.log(data); }
			if ( chunk.isDirty ) {
				chunk.setRenderObject( Forge.ChunkModule.render( chunk ) );
				chunk.clean();
			}
			
			setTimeout(arguments.callee(renderData), 10);
		}
		
	}
	
	
	/*
		Checks if the side if a block is visible or not
		@pos - THREE.Vector3
	*/
	function isSideVisible(pos) {
		var block = this.getBlock(pos)

		// if block is empty then side is visible. If block is non-existant we treat as a block and don't render the side.
		return block === 0;
	};


	/*
		Get block type for a world position
		@pos - Three.Vector3 of world position
	*/
	function getBlock(pos) {
		var chunk_size = Forge.Config.chunk_size;
		var x = pos.x; var y = pos.y; var z = pos.z;

		var rX = x >= 0 ? ~~(x / chunk_size) : ~~((x + 1) / chunk_size) - 1;
		var rY = y >= 0 ? ~~(y / chunk_size) : ~~((y + 1) / chunk_size) - 1;
		var rZ = z >= 0 ? ~~(z / chunk_size) : ~~((z + 1) / chunk_size) - 1;

		var posX = x & 31;
		var posY = y & 31;
		var posZ = z & 31;

		var hash = Forge._2.hash3(rX, rY, rZ);	
		var chunkData = visible.get(hash);

		if (chunkData === undefined) return 1;
	
		return chunkData.getData( posX, posY, posZ );
	};
	
	
	exports.isSideVisible = isSideVisible;
	
	exports.getBlock = getBlock;
	
	
	return exports;
	
})({});