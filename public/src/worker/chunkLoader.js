//importScripts('/js/lib/ThreeWorker.js');
importScripts('/js/lib/ThreeWebWorker.js');

importScripts('/src/forge.js');
importScripts('/src/utils/math.js');
importScripts('/src/utils/two.js');
importScripts('/src/utils/orderedMap.js');
importScripts('/src/world/blockManager.js');
importScripts('/src/models/chunk.js');
importScripts('/src/world/chunkCache.js');

(function(){
  
  var update_list = []; // chunks to update
  var processed_queue = [];

  var cache = new Forge.ChunkCache();
  var blockManager = new Forge.BlockManager({ source: 'worker' });
  
  var chunk_size = Forge.Config.chunk_size;
  var block_size = Forge.Config.block_size;
  
  /*
    Request chunks from the server
    @param hash - hash of chunks to update
    @param pos - vertex of player's position
  */
  function loadChunks(hash, pos) {
    var params;    
    //var new_update_list = [];

    // add request for neighbors of
    // each hash. I'm iterating over the hash
    // object, so might as well use the same
    // loop to create the new update list, instead
    // of using a utility function from underscore.js
    // which will create a new iteration
    for( key in hash ) {
      //new_update_list.push(key);
      update_list.push(key);
      Forge._2.buildNeighbors( key, hash );
    }
    
    //update_list = new_update_list;

    // send hashes that need updating to the server
    params = encodeURIComponent( JSON.stringify({h:hash,p:pos}) );
		
    Forge._2.ajaxBinary("/load", processChunks, params);
  }


  /*
    Callback for ajax call to server.
    Processes Chunks, then adds them to the cache
  */
  function processChunks() {
    var bufPos = 0;

		var coordinates, hash, chunk_data;
		
		// Iterate ArrayBuffer for chunks
		while ( bufPos < this.response.byteLength - 1) {

      // pull region coordinates
			coordinates = Forge._2.getCoordinates(this.response, bufPos);
			bufPos += 12;

			hash = Forge._2.hash3(coordinates.x, coordinates.y, coordinates.z);
      
      // pull single chunk data
		  chunk_data = new Forge.Chunk({
        position: coordinates,
        data: new Uint8Array(this.response, bufPos, 32768)
      });
      
      cache.set(hash, chunk_data);
      
			bufPos += 32768;
		}
   
    buildGeometries();

  }


  /*
    Iterate over update list and start adding
    geometries to the queue.
    Need to do this asynchronously or else we
    need to process all chunks before sending any
    out. Interestingly enough it's almost as if the
    web worker will never achieve this task, like
    if it freezes.
  */
  function buildGeometries() {
    var
        chunk, key;// i, len;
    
    //i = 0; len = update_list.length;
    
    setTimeout(iterateGeometries, 50); // iterate asynchronously
    
    function iterateGeometries() {
      //if ( i >= len )
      if ( update_list.length === 0 )  
        return;
      
      chunk = cache.get( update_list.shift() );
      
      // as geometry building starts to stack up,
      // it's possible that the update_list will already
      // be updated to the next view.
      // In that case we skip building this chunk
      if ( chunk !== undefined ) {
        buildGeometry( chunk );
      } else {
        throw JSON.stringify(update_list);
      }
    
      //i++;
      setTimeout(arguments.callee, 50);
    }
    
  }
  
  
  function buildGeometry( chunk ) {
  
    var u, v, w;
    var pos = chunk.getPosition();

    var materials = blockManager.getGrass();
    
		// Geometry
	  var 
		  cube,
      mesh,
      empty = true, // flag indicating if all blocks are air
		  geometry = new THREE.Geometry(); 

		// Faces
		var px, py, pz, nx, ny, nz;
		var block, topIndex, bottomIndex, leftIndex, rightIndex, frontIndex, backIndex;

		// Build mesh
	  for (u = 0; u < chunk_size; u++) {
	    for (v = 0; v < chunk_size; v++) {
	      for (w = 0; w < chunk_size; w++) {

          // check for visibility
          // this determines if we need to render
          // geometry at all
	        px = py = pz = nx = nz = ny = 0;   

					ny = isSideVisible( Forge.Math.getWorldCoordinates(pos, u, v - 1, w) );
					py = isSideVisible( Forge.Math.getWorldCoordinates(pos, u, v + 1, w) );
					px = isSideVisible( Forge.Math.getWorldCoordinates(pos, u - 1, v, w) );
					nx = isSideVisible( Forge.Math.getWorldCoordinates(pos, u + 1, v, w) );
					pz = isSideVisible( Forge.Math.getWorldCoordinates(pos, u, v, w + 1) );
					nz = isSideVisible( Forge.Math.getWorldCoordinates(pos, u, v, w - 1) );

					if (nz === 0 && py === 0 && px === 0 && nx === 0 && pz === 0 && nz === 0) {
						continue;
					}

          block = chunk.getBlock(u, v, w);
  
          // if we find a block then
          // calculate geometry
	        if (block === 1) {
            
	          cube = new THREE.CubeGeometry( block_size, block_size, block_size, 1, 1, 1, materials, false, { px: px, nx: nx, py: py, ny: ny, pz: pz, nz: nz });

	          mesh = new THREE.Mesh(cube);
	          mesh.position.set((u * block_size) + pos.x * chunk_size * block_size, 
                              (v * block_size) + pos.y * chunk_size * block_size, 
                              (w * block_size) + pos.z * chunk_size * block_size);

	          THREE.GeometryUtils.merge( geometry, mesh );

	          empty = false;
	        }

	      }
	    }
	  }
    
    // Add to queue
    if ( !empty ) {
      processed_queue.push( { d: Forge.Math.serializeGeometry( geometry ), p: pos } );
    }
  }
  
  
  /*
    Get block type based on world position
  */
  function getWorldBlock( pos ) {
		var x = pos.x; var y = pos.y; var z = pos.z;

		var rX = x >= 0 ? ~~(x / chunk_size) : ~~((x + 1) / chunk_size) - 1;
		var rY = y >= 0 ? ~~(y / chunk_size) : ~~((y + 1) / chunk_size) - 1;
		var rZ = z >= 0 ? ~~(z / chunk_size) : ~~((z + 1) / chunk_size) - 1;

		var posX = x & 31;
		var posY = y & 31;
		var posZ = z & 31;

		var hash = Forge._2.hash3(rX, rY, rZ);	
		var chunk_data = cache.get(hash);

    // if the chunk region is undefined
    // then we assume that it is solid
		if (chunk_data === undefined) 
		  return 1;
	
		return chunk_data.getBlock( posX, posY, posZ );
  }
  
  
  /*
    Determines if a block at a given position
    is transparent
  */
  function isSideVisible( pos ) {
    var block = getWorldBlock( pos );

		// if block is empty then side is visible. If block is non-existant we treat as a block and don't render the side.
		return block === 0;
  }  


  /*
    Sends next queued chunk to client
    window. If no chunk is available,
    don't send any message
  */
  function next() {
    if (processed_queue.length > 0) {
      self.postMessage(processed_queue.shift());
      return;
    }
  }


  /*
    Handles routing of received
    worker messages
  */
  function handler(e) {
    var data = e.data;

    switch(data.n) {
      case 'next':
          next();
        break;
      case 'queue':
          loadChunks(data.hash, data.pos);
        break;
      default:
        throw new Error('chunkLoader.js: Unrecognized message name');
    }
  }
  

  self.addEventListener('message', handler, false);

})();


