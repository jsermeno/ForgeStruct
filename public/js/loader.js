Forge.Loader = (function(exports){
	
	var stats, scene, camera, renderer;
	
	function init() {
		bootRenderer();
		bootWorld();
		drawAxes();
	}
	
	
	function bootWorld() {
		Forge.World.update();
	}
	
	
	function bootRenderer() {
		//camera = new THREE.Camera(30, window.innerWidth / window.innerHeight, 1, 1000);
		camera = new THREE.FirstPersonCamera( {

			fov: 60, aspect: window.innerWidth / window.innerHeight, near: 1, far: 20000,
			movementSpeed: 1000, lookSpeed: 0.125, noFly: false, lookVertical: true, constrainVertical: true

		} );
				
		scene = new THREE.Scene();
		
		// Create renderer
		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
		renderer.domElement.id = "gl_canvas";
		
		// Stats.js
		stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.top = "0";
		
		// Share
		Forge.Shared.scene = scene;
		Forge.Shared.camera = camera;
		
		document.body.appendChild(stats.domElement);
		document.body.appendChild(renderer.domElement);
	}
	
	
	function animate() {
		requestAnimationFrame( animate );
	
		stats.update();
		Forge.Player.update();	
		render();
	}
	
	
	function render() {
		renderer.render( scene, camera );
	}
	
	
	/*
		Start game after initial loading.
		Removes loading screen etc.
	*/
	exports.start = function() {
		document.getElementById('loading_screen').style.display = 'none';
		camera.position.set(200, 2000, 200);
		
		animate();
	}
	
	
	/*
		Utility function to draw x, y, z axes for debug reference
	*/
	function drawAxes() {
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
	
	init();
	
	return exports;
	
})({});