/*
	General purpose chunk functionality that
	I don't want instantiated multiple times
	@author Justin Sermeno
*/

Forge.ChunkModule = (function(exports){
	var oneTime = false;
	//var materials = Forge.Block.loadGrassMaterials();
	
	/*
		Builds a vector of world coordinates
		@pos - THREE.Vector3
		@x - local x
		@y - local y
		@z - local z
	*/
	function getWorldCoordinates(pos, x, y, z) {
		var chunk_size = Forge.Config.chunk_size;
		
		var wX = (pos.x * chunk_size) + x;
		var wY = (pos.y * chunk_size) + y;
		var wZ = (pos.z * chunk_size) + z;
		
		return new THREE.Vector3(wX, wY, wZ);
	}
	
	
	/*
		Renders a chunk as a three.js mesh
	*/
	exports.render = function( chunk ) {
		
		var pos = chunk.getPosition();
		var u, v, w;
		
		// references
		var world = Forge.World;
		var scene = Forge.Shared.scene;
		var chunk_size = Forge.Config.chunk_size;
		var block_size = Forge.Config.block_size;

		// Geometry
	  var 
		  cube,
		  mesh, 
		  materials = Forge.Block.loadGrassMaterials(),
		  geometry = new THREE.Geometry(),
		  empty = true;

		// Faces
		var px, py, pz, nx, ny, nz;
		var block, topIndex, bottomIndex, leftIndex, rightIndex, frontIndex, backIndex;

		// Build mesh
	  for (u = 0; u < chunk_size; u++) {
	    for (v = 0; v < chunk_size; v++) {
	      for (w = 0; w < chunk_size; w++) {

	        px = py = pz = nx = nz = ny = 0;   

					ny = world.isSideVisible( getWorldCoordinates(pos, u, v - 1, w) );
					py = world.isSideVisible( getWorldCoordinates(pos, u, v + 1, w) );
					px = world.isSideVisible( getWorldCoordinates(pos, u - 1, v, w) );
					nx = world.isSideVisible( getWorldCoordinates(pos, u + 1, v, w) );
					pz = world.isSideVisible( getWorldCoordinates(pos, u, v, w + 1) );
					nz = world.isSideVisible( getWorldCoordinates(pos, u, v, w - 1) );

					if (nz === 0 && py === 0 && px === 0 && nx === 0 && pz === 0 && nz === 0) {
						empty = false;
						continue;
					}

					block = world.getBlock( getWorldCoordinates(pos, u, v, w) );

	        if (block === 1) {

	          cube = new THREE.CubeGeometry( block_size, block_size, block_size, 1, 1, 1, materials, false, { px: px, nx: nx, py: py, ny: ny, pz: pz, nz: nz });

	          mesh = new THREE.Mesh(cube);
	          mesh.position.set((u * block_size) + pos.x * chunk_size * block_size, (v * block_size) + pos.y * chunk_size * block_size, (w * block_size) + pos.z * chunk_size * block_size);

	          GeometryUtils.merge( geometry, mesh );

	          empty = false;
	        }

	      }
	    }
	  }

	  // If we get back an empty chunk then don't add it, but set to null to free space
	  if ( !empty ) {
	    mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
	  	scene.addObject( mesh );

	    // character collisions
	    //THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshColliderWBox(mesh) );
			if (!oneTime) {
				console.log("Logging geometry...");
		    console.log(geometry.faces);
				oneTime = true;
			}
			return mesh;
	  }

		return undefined;
		
	}

	return exports;
	
})({});