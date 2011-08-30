/*
	Represents the world space and landscape
	@author Justin Sermeno
*/
Forge.World = (function(exports){
	
	var visible_hash = {};
  var visible = new THREE.Object3D();

  var radiusX = Forge.Config.v_dist_x / 2;
	var radiusY = Forge.Config.v_dist_y / 2;
	var radiusZ = Forge.Config.v_dist_z / 2;

  var lastRegion; // last known of region of the player

  var chunkCache;
  
	/*
		Updates world on tick
	*/
	exports.update = function() {
		
    // Update next chunk
    Forge.ChunkManager.updateChunk();
    
		// Update visible
    //console.time('updateVisible');
    updateVisible();
		//console.timeEnd('updateVisible');
	};
	
	
  /*
    Updates visible chunks
    Queues chunks that need updating
    into the ChunkManager
  */
  function updateVisible() {
    var 
      u, v, w, chunk, hash;
  
    var pos = Forge.Player.getRegion();
    var new_visible_hash = {};
    var chunks_to_queue = {};
    var update = false;

    // Only update visible if the regions have changed
    /*if ( lastRegion !== undefined ) {
      if ( pos.distanceTo( lastRegion ) === 0 )
        return;
    }
   
    lastRegion = pos;
    console.log("updating visible…");*/
    visible.children = [];

    for ( u = pos.x - radiusX; u <= pos.x + radiusX; u++) {
			for ( v = pos.y - radiusY; v <= pos.y + radiusY; v++) {
				for ( w = pos.z - radiusZ; w <= pos.z + radiusZ; w++) {
          chunk = chunkCache.load(u, v, w);
          hash = Forge._2.hash3(u, v, w);

          if ( !exports.isChunkVisible( hash )) {
            // Chunk is not in cache
            // or we are loading the chunk
            // back into view. Need to
            // retrieve it
            chunks_to_queue[ hash ] = 1;
            update = true;
          } else if( chunk === undefined ) {
            // do nothing
            // if we reach this statement, then
            // we are waiting for the chunk to load
          }
          else {
            // Loading chunk from cache
            // save in visible object
            hash = chunk.hash;
            visible.addChild( chunk.mesh );
          }

          new_visible_hash[ hash ] = 1;
        }
      }
    }
    
    // update chunks
    if ( update ) {
      Forge.ChunkManager.queueForUpdate( chunks_to_queue, pos );
    }
    
    // Finish updating new visible hash
    visible_hash = new_visible_hash;
  }
  

  /*
    Checks if a chunk is visible
  */
  exports.isChunkVisible = function( hash ) {
    return visible_hash[ hash ] !== undefined;
  };


  /*
    Load initial world state
  */
  exports.loadWorld = function() {
    var scene = Forge.Shared.scene;
    
    Forge.Shared.chunkCache = chunkCache = new Forge.ChunkCache();    

    updateVisible();    

    scene.addObject(visible);
  };
	
	
	return exports;
	
})({});