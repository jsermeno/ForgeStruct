/*
	Class Chunk
	Handles chunk specific operations
*/
Forge.Chunk = function(world, x, y, z) {
	
	this.posX = x;
	this.posY = y;
	this.posZ = z;
	this.world = world;
	
	this.chunk_size = Forge.Config.chunk_size;
	this.block_size = Forge.Config.block_size;
	
};


/**
*	Builds chunk
*
*	@return reference to mesh
*/
Forge.Chunk.prototype.render = function() {
	//console.log("rendering... x: " + this.posX + ", y: " + this.posY + ", z: " + this.posZ);
	
	// References
	var world = this.world;
	var scene = Forge.Shared.scene;
	
	// Coordinates
	var u, v, w;
  
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
  
  for (u = 0; u < this.chunk_size; u++) {
    for (v = 0; v < this.chunk_size; v++) {
      for (w = 0; w < this.chunk_size; w++) {
      
        px = py = pz = nx = nz = ny = 0;   
              
				ny = world.isSideVisible(this.getWorldX(u), this.getWorldY(v - 1), this.getWorldZ(w));
				py = world.isSideVisible(this.getWorldX(u), this.getWorldY(v + 1), this.getWorldZ(w));
				px = world.isSideVisible(this.getWorldX(u - 1), this.getWorldY(v), this.getWorldZ(w));
				nx = world.isSideVisible(this.getWorldX(u + 1), this.getWorldY(v), this.getWorldZ(w));
				pz = world.isSideVisible(this.getWorldX(u), this.getWorldY(v), this.getWorldZ(w + 1));
				nz = world.isSideVisible(this.getWorldX(u), this.getWorldY(v), this.getWorldZ(w - 1));
        
				if (nz === 0 && py === 0 && px === 0 && nx === 0 && pz === 0 && nz === 0) {
					empty = false;
					continue;
				}
				
				block = world.getBlock(this.getWorldX(u), this.getWorldY(v), this.getWorldZ(w ));

        if (block === 1) {
          
          cube = new THREE.CubeGeometry( this.block_size, this.block_size, this.block_size, 1, 1, 1, materials, false, { px: px, nx: nx, py: py, ny: ny, pz: pz, nz: nz });
        
          mesh = new THREE.Mesh(cube);
          mesh.position.set((u * this.block_size) + this.posX * this.chunk_size * this.block_size, (v * this.block_size) + this.posY * this.chunk_size * this.block_size, (w * this.block_size) + this.posZ * this.chunk_size * this.block_size);
          
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
    THREE.Collisions.colliders.push( THREE.CollisionUtils.MeshColliderWBox(mesh) );

		return mesh;
  }

	return undefined;
}


Forge.Chunk.prototype.getWorldX = function(x) {
	return (this.posX * this.chunk_size) + x;
};


Forge.Chunk.prototype.getWorldY = function(y) {
	return (this.posY * this.chunk_size) + y;
};


Forge.Chunk.prototype.getWorldZ = function(z) {
	return (this.posZ * this.chunk_size) + z;
};

