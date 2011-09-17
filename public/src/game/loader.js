/*
	Initial load of game
	@author Justin Sermeno
*/
Forge.Loader = (function(exports){
	
	var stats, scene, camera, renderer, worker, projector;
	
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
    Forge.World.loadWorld();
   
		window.onload = function(){ Forge.Game.start() };
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
		Forge.Shared.camera = camera;
				
		// scene
		scene = new THREE.Scene();
		Forge.Shared.scene = scene;
		
		// projector
		projector = new THREE.Projector();
		Forge.Shared.projector = projector;
		
		// Init Sky / Environment
		Forge.Sky.initSky();
		
		// Create renderer
		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setSize( window.innerWidth / 2, window.innerHeight / 2);
		renderer.domElement.id = "gl_canvas";
		
		// Stats.js
		stats = new Stats();
		stats.domElement.style.position = "absolute";
		stats.domElement.style.top = "0";
		   
    // Initialize Worker 
    worker = Forge.ChunkManager.spawnWorker();

    // Initialize BlockManager
    Forge.Shared.blockManager = new Forge.BlockManager({ source: 'clientWindow' });

		// Share
		Forge.Shared.stats = stats;
		Forge.Shared.renderer = renderer;
    Forge.Shared.worker = worker;
		
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