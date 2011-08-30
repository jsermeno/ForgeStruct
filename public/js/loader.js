/*
	Initial load of game
	@author Justin Sermeno
*/
Forge.Loader = (function(exports){
	
	var stats, scene, camera, renderer, worker;
	
	/*
		First non-closure function called in execution
	*/
	function init() {
		bootRenderer();
		bootWorld();
		drawAxes();
	}
	
	
	/*
		Runs functions necessary to updating and processing of the game world
	*/
	function bootWorld() {
		/*worker = new Worker('/js/worker/worker.js');
		worker.onmessage = function(event) {
			//console.log("Worker said: " + event.data);
			console.timeEnd("load worker vertices");
			console.log("received worker data");
			var data = JSON.parse(event.data);
			var geometry = new THREE.Geometry();
			geometry.vertices = data;
			//console.log(event.data);
			var line = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00FF00 }));
			//var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0x00FF00 } ));
	    //scene.addObject( line );
		}
		console.time("load worker vertices");
		worker.postMessage({ n: "pos", pos: Forge.Player.getPosition() });
		
		Forge.Shared.worker = worker;*/
		Forge.World.update();
		
		/*var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 0, 0, 0)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 100, 0, 0)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 100, 100, 0)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 0, 100, 0)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 0, 0, 100)));
		geometry.vertices.push(new THREE.Vertex(new THREE.Vector3( 100, 0, 100)));
		
		geometry.faces.push(new THREE.Face4(0, 3, 2, 1));
		
		geometry.computeCentroids();
		geometry.computeFaceNormals();
		
		//var geometry  = new THREE.CubeGeometry( 100, 100, 100, 1, 1, 1, undefined, false, { px: 1, nx: 1, py: 1, ny: 1, pz: 0, nz: 0 });
		
		var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00FF00 }));
		mesh.position.set(0, 0, 0);
		
		scene.addObject(mesh);*/
		
		//window.onload = function(){Forge.Game.start()};
	}
	
	
	/*
		Initializes components necessary for rendering
	*/
	function bootRenderer() {
		//camera = new THREE.Camera(30, window.innerWidth / window.innerHeight, 1, 1000);
		camera = new THREE.FirstPersonCamera( {

			fov: 30, aspect: window.innerWidth / window.innerHeight, near: 1, far: 20000,
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
		Forge.Shared.stats = stats;
		Forge.Shared.renderer = renderer;
		
		document.body.appendChild(stats.domElement);
		document.body.appendChild(renderer.domElement);
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