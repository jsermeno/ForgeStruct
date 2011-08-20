/*
	Abstracts retrieving and updating chunks through a cache
*/
Forge.Cache = (function(exports){
	
	var cache = new Forge.OrderedMap();
	var capacity = 512;
	var refreshSize = 128;
	
	var radiusX = Forge.Config.v_dist_x / 2;
	var radiusY = Forge.Config.v_dist_y / 2;
	var radiusZ = Forge.Config.v_dist_z / 2;
	
	/*
		Update chunks
		@param visible - OrderedMap of visible chunks
		@param cb - callback that accepts an OrderedMap of newly visible chunks
		and an OrderedMap of chunks to be removed
	*/
	exports.updateVisible = function(visible, cb) {
		var u, v, w;
		var hash;
		
		var pos = Forge.Math.wtorCoordinates( Forge.Player.getPosition() );
		
		var new_visible = new Forge.OrderedMap();
		
		var hit_server = false;
		
		// loop over visible area
		for ( u = pos.x - radiusX; u <= pos.x + radiusX; u++) {
			for ( v = pos.y - radiusY; v <= pos.y + radiusY; v++) {
				for ( w = pos.z - radiusZ; w <= pos.z + radiusZ; w++) {
					hash = Forge._2.hash3(u, v, w);
					
					// if chunk is already stored in visible hash then skip
					if ( visible.get(hash) !== undefined ) {
						new_visible.set(hash, visible.get(hash));
						visible.remove(hash);	
						continue;
					}
					
					// if chunk is stored in cache then place in visible hash
					if ( cache.get(hash) !== undefined ) {
						cache.get(hash).setDirty();
						new_visible.set(hash, cache.get(hash));
						continue;
					}
					
					// if we find something not in the cache then we need to make a request to the server
					hit_server = true;
				}
			}
		}
		
		if ( hit_server ) updateFromServer(new_visible, visible, pos, cb);
		else cb( new_visible, visible );
		
	}
	
	
	/*
		Updates visible and cache from server
	*/
	function updateFromServer(new_visible, visible, pos, cb) {
		// build data to send
		var data = {};
				
		data.pos = pos;
		data.visible = new_visible.getHashOfKeys();
		
		var params = encodeURIComponent( JSON.stringify(data) );
		
		Forge._2.ajaxBinary("/load", updateOnload, params);
		
		// inner function that handles ajax binary response
		function updateOnload() {
			
			var bufPos = 0;

			var coordinates, hash, chunk;
			
			// loop through array buffer
			while ( bufPos < this.response.byteLength - 1) {
				coordinates = Forge._2.getCoordinates(this.response, bufPos);
				bufPos += 12;
				
				// Check if we're just receiving a hash
				if ( coordinates.x === 0x0FFFFFFF && coordinates.y === 0x0FFFFFFF )
					continue;

				hash = Forge._2.hash3(coordinates.x, coordinates.y, coordinates.z);

				chunk = new Forge.Chunk({
					x: coordinates.x,
					y: coordinates.y,
					z: coordinates.z,
					data: new Uint8Array(this.response, bufPos, 32768)
				});
				
				bufPos += 32768;
				
				cache.set(hash, chunk);
				new_visible.set(hash, chunk);
			}
		
			// initiate callback
			cb( new_visible, visible);
		}
	}
	
	
	/*
		Set a cache value and do validation on
		cache size
	*/
	function setCache(key, value) {
		var i;
		
		// Check if cache is full
		if (cache.size() > capacity) {
			cache.sort();
			
			for (i = 0; i < refreshSize; i++) {
				cache.removeFirst();
			}
		}
		
		cache.set(key, value);
	}
	
	
	/*
		Sorting function to sort chunks by
		distance. Higher distances come first.
	*/
	function sortCache(a, b) {
		if (a.getDistanceFromPlayer() > b.getDistanceFromPlayer() )
			return -1;
		if (a.getDistanceFromPlayer() < b.getDistanceFromPlayer() )
			return 1;
			
		return 0;
	}


	return exports;
	
})({});