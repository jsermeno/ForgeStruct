(function(){
	
	var stats, camera, scene, renderer;
	var CHUNK_SIZE = 32;
	
	
	function init() {
	
		//camera = new THREE.Camera(30, window.innerWidth / window.innerHeight, 1, 1000);
		camera = new THREE.FirstPersonCamera( {

			fov: 60, aspect: window.innerWidth / window.innerHeight, near: 1, far: 25000,
			movementSpeed: 1000, lookSpeed: 0.125, noFly: false, lookVertical: true

		} );
		
		scene = new THREE.Scene();
		
		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
		renderer.domElement.id = "gl_canvas";
		
		// Stats.js
		stats = new Stats();
		stats.domElement.style.position = "absolute";
		
		document.body.appendChild(stats.domElement);
		document.body.appendChild(renderer.domElement);
		
		initChunk();
		initAxis();
		animate();
	
	}
	
	function animate() {
		requestAnimationFrame( animate );
	
		stats.update();	
		render();
	}
	
	function render() {
		renderer.render( scene, camera );
	}
	
	// Functionality
	
	function initChunk() {	
    var 
		  cube, 
		  mesh, 
		  materials = loadMaterials(),
		  geometry = new THREE.Geometry(),
		  px, py, pz, nx, ny, nz,
		  xPos, yPos, zPos;
		
		var u, v, w, index, topIndex, bottomIndex, leftIndex, rightIndex, frontIndex, backIndex;
		var i, j, k, region;
		
		var MAX_WIDTH = 7;
		var MAX_DEPTH = 7;
		var MAX_HEIGHT = 1;
		
		// Iterate over regions
		for ( i = 0; i < MAX_WIDTH; i++ ) {
      for ( j = 0; j < MAX_HEIGHT; j++) {
        for (k = 0; k < MAX_DEPTH; k++) {
          //i = 0; j = 0; k = 0;
		      region = map_data[i + (j * CHUNK_SIZE + k) * CHUNK_SIZE];
		    
		      // Iterate for each block
          for ( u = 0; u < CHUNK_SIZE; u++ ) {
            for ( v = 0; v < CHUNK_SIZE; v++) {
              for (w = 0; w < CHUNK_SIZE; w++) {
           
                px = py = pz = nx = nz = ny = 0;   
                
                index = u + ( v * CHUNK_SIZE + w ) * CHUNK_SIZE;
                
                // calculate which faces to render
                topIndex = u + ( (v + 1) * CHUNK_SIZE + w ) * CHUNK_SIZE;
                bottomIndex = u + ( (v - 1) * CHUNK_SIZE + w ) * CHUNK_SIZE;
                leftIndex = (u - 1) + ( v * CHUNK_SIZE + w ) * CHUNK_SIZE;
                rightIndex = (u + 1) + ( v * CHUNK_SIZE + w ) * CHUNK_SIZE;
                frontIndex = u + ( v * CHUNK_SIZE + (w + 1)) * CHUNK_SIZE;
                backIndex = u + ( v * CHUNK_SIZE + (w - 1)) * CHUNK_SIZE;
                
                // currentPosition
                //yPos = (j * 16) + v;
                //xPos = (i * 16) + u;
                //zPos = (k * 16) + w;
                
                /*ny = ((region[bottomIndex] === 1 || region[topIndex] === undefined) && (yPos !== 0) ) ? 0 : 1;
                py = ((region[topIndex] === 1 || region[topIndex] === undefined) && (yPos !== (MAX_HEIGHT * 16) - 1) ) ? 0 : 1;
                px = ((region[leftIndex] === 1 || region[leftIndex] === undefined) && (xPos !== 0) ) ? 0 : 1;
                nx = ((region[rightIndex] === 1 || region[rightIndex] === undefined) && (xPos !== (MAX_WIDTH * 16) - 1) ) ? 0 : 1;
                pz = ((region[frontIndex] === 1 || region[frontIndex] === undefined) && (zPos !== (MAX_DEPTH * 16) - 1) ) ? 0 : 1;
                nz = ((region[backIndex] === 1 || region[backIndex] === undefined) && (zPos !== 0)) ? 0 : 1;*/
                
                ny = ((region[bottomIndex] === 1 || region[bottomIndex] === undefined) && (v !== 0) ) ? 0 : 1;
                py = ((region[topIndex] === 1 || region[topIndex] === undefined) && (v !== CHUNK_SIZE - 1) ) ? 0 : 1;
                px = ((region[leftIndex] === 1 || region[leftIndex] === undefined) && (u !== 0) ) ? 0 : 1;
                nx = ((region[rightIndex] === 1 || region[rightIndex] === undefined) && (u !== CHUNK_SIZE - 1) ) ? 0 : 1;
                pz = ((region[frontIndex] === 1 || region[frontIndex] === undefined) && (w !== CHUNK_SIZE - 1) ) ? 0 : 1;
                nz = ((region[backIndex] === 1 || region[backIndex] === undefined) && (w !== 0)) ? 0 : 1;
                
                
                if (region[index] === 1) {
                
                  cube = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1, materials, false, { px: px, nx: nx, py: py, ny: ny, pz: pz, nz: nz });
                
                  mesh = new THREE.Mesh(cube);
                  mesh.position.set((u * 100) + i * CHUNK_SIZE * 100, (v * 100) + j * CHUNK_SIZE * 100, (w * 100) + k * CHUNK_SIZE * 100);
                  
                  GeometryUtils.merge( geometry, mesh );
                }
            
              }
            }
          }
		      
		    
		    }
		  }
		}
		
    
  	mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
  	scene.addObject( mesh );
		
	}
	
  	
	function loadMaterials() {
	 
    var grass_dirt, grass, dirt;
    
    grass_dirt = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("assets/textures/grass_dirt.png") });
    grass = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("assets/textures/grass.png") });
    dirt = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("assets/textures/dirt.png") });
    
    return [
     grass_dirt,
     grass_dirt,
     grass,
     dirt,
     grass_dirt,
     grass_dirt
    ];
	
	}
	
	
	function initAxis() {
	
    var geometry, line;
    
    // x axis - RED
    geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 0, 0)) );
    geometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 3000, 0, 0)) );
    
    
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0xFF0000 } ));
    scene.addObject( line );	

    // y axis - GREEN
    geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 0, 0)) );
    geometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 3000, 0)) );
    
    
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0x00FF00 } ));
    scene.addObject( line );
    
    // z axis - BLUE
    geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 0, 0)) );
    geometry.vertices.push( new THREE.Vertex(new THREE.Vector3( 0, 0, 3000)) );
    
    
    line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0x0000FF } ));
    scene.addObject( line );
	
	}
	

	// Run initialization
	
	init();
	
})();