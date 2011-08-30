/*
	Utility class for world math
	@author Justin Sermeno
*/
Forge.Math = (function(exports){
	
	var chunk_size = Forge.Config.chunk_size;
	var block_size = Forge.Config.block_size;
	
	/*
		World to region coordinates
		@pos THREE.Vector3 of world coordinates
	*/
	exports.wtorCoordinates = function(pos) {
			
		var rX = pos.x >= 0 ? ~~(pos.x / (chunk_size * block_size)) : ~~((pos.x + 1) / (chunk_size * block_size)) - 1;
		var rY = pos.y >= 0 ? ~~(pos.y / (chunk_size * block_size)) : ~~((pos.y + 1) / (chunk_size * block_size)) - 1;
		var rZ = pos.z >= 0 ? ~~(pos.z / (chunk_size * block_size)) : ~~((pos.z + 1) / (chunk_size * block_size)) - 1;
		
		return new THREE.Vector3(rX, rY, rZ);
	};
	
	
	/*
    Gets world coordinates based on region position
    and offset coordinates
    @param pos - region position object containing
    keys x, y, and z
    @param x - offset X
    @param y - offset Y
    @param z - offset Z
	*/
	exports.getWorldCoordinates = function(pos, x, y, z) {
		var chunk_size = Forge.Config.chunk_size;
		
		var wX = (pos.x * chunk_size) + x;
		var wY = (pos.y * chunk_size) + y;
		var wZ = (pos.z * chunk_size) + z;
		
		return new THREE.Vector3(wX, wY, wZ);
	}


  /*
    Serializes a THREE.Geometry
    @param geometry - THREE.Geometry object to serialize
  */
  exports.serializeGeometry = function( geometry ) {

    var vertices = geometry.vertices;
    var faces = geometry.faces;
    var faceVertexUvs = geometry.faceVertexUvs[0];
   
    var serialized = JSON.stringify({ v: vertices, f: faces, uv: faceVertexUvs });

    // Try to shrink the size of the 
    // data passed over the web worker
    serialized = serialized.replace(/position/g, 'p');
    serialized = serialized.replace(/materials/g, 'm');
    serialized = serialized.replace(/\"normal\".*?Tangents\":\[\],/g, '');
    serialized = serialized.replace(/,\"centroid\".*?}/g, '');
    
    return serialized;
  };


  /*
    Unserialize THREE.Geometry
    @param data_string - JSON string output from
    Forge.Math.geometryToJSON
  */
  exports.unserializeGeometry = function( dataString ) {

    // parse data
    var data = JSON.parse( dataString );
    var vertices = data.v;
    var faces = data.f;
    var uvs = data.uv; 

    var 
      i, len, 
      dataElement,
      blockManager = Forge.Shared.blockManager;
      geometry = new THREE.Geometry();

    // add vertices to geometry
    for ( i = 0, len = vertices.length; i < len; i++ ) {
      dataElement = vertices[i].p;

      geometry.vertices.push( new THREE.Vertex(new THREE.Vector3(dataElement.x, dataElement.y, dataElement.z)) );
    }

    // add faces to geometry
    for ( i = 0, len = faces.length; i < len; i++ ) {
      dataElement = faces[i];
      
      geometry.faces.push( 
        new THREE.Face4( 
          dataElement.a, 
          dataElement.b, 
          dataElement.c, 
          dataElement.d, 
          null, 
          null, 
          blockManager.getFaceMaterial( dataElement.m[0] ) 
        )
      );
      
    }
    
    // add face vertex uvs
    for ( i = 0, len = uvs.length; i < len; i++ ) {
      dataElement = uvs[i];
      
      geometry.faceVertexUvs[0].push([
        new THREE.UV(dataElement[0].u, dataElement[0].v),
        new THREE.UV(dataElement[1].u, dataElement[1].v),
        new THREE.UV(dataElement[2].u, dataElement[2].v),
        new THREE.UV(dataElement[3].u, dataElement[3].v),
      ]);
    }

    return geometry;
    
  };
	
	return exports;
	
})({});