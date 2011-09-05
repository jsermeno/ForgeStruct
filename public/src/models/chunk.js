/*
	Model representing a single chunk existing someplace in 3D
	space
	@author Justin Sermeno
*/
Forge.Chunk = (function(){
	
  var chunk_size = Forge.Config.chunk_size;

  /*
    constructor
    @param spec - params, requires position,
    requires chunk_data || mesh
  */
	function Chunk(spec) {
		
		this.position = spec.position || new THREE.Vector3( 0, 0, 0);
		this.chunk_data = spec.data || null;
    
    this.hash = Forge._2.hash3(this.position.x, this.position.y, this.position.z);
    
    if ( spec.mesh !== undefined ) {
      this.mesh = spec.mesh;
      this.mesh.hash = this.hash;
    }
	}
	
  /*
    Gets position
    @return - returns a THREE.Vector3 position object
  */
  Chunk.prototype.getPosition = function() {
    return this.position;
  };


  /*
    Gets block at a specific point
    @param x - x coordinate chunk offset
    @param y - y coordinate chunk offset
    @param z - z coordinate chunk offset
  */
  Chunk.prototype.getBlock = function(x, y, z) {
		return this.chunk_data[ z + ( x  * chunk_size + y ) * chunk_size ];
  }

	
	return Chunk;
	
})();