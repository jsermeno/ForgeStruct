/*
	Manages game state and updates
	@author Justin Sermeno
*/
Forge.Game = (function(exports){
	
	var camera;
	var scene;
	var stats;
	var renderer;
	
	var next_game_tick = new Date().getTime();
	var loops;
	var erp;
	
	// constants
	var ticks_per_second = 25;
	var skip_ticks = 1000 / 25;
	var max_frameskip = 5;
	var max_tolerance = 5000; // 5 seconds
	
	/*
		Start game after initial loading.
		Removes loading screen etc.
	*/
	function start() {
		scene = Forge.Shared.scene;
		camera = Forge.Shared.camera;
		stats = Forge.Shared.stats;
		renderer = Forge.Shared.renderer;
		
		document.getElementById('loading_screen').style.display = 'none';
		camera.position.set(200, 2000, 200);
		
		animate();
	}


	/*
		handles game loop
	*/
	function animate() {
		requestAnimationFrame( animate );

		loops = 0;
		while( (new Date()).getTime() > next_game_tick && loops < max_frameskip) {
			updateGame();
			
			next_game_tick += skip_ticks;
			loops++;
		}
		
		// after a certain tolerance level we skip next_game_tick ahead
		if ( (new Date()).getTime() > (next_game_tick + max_tolerance) )
			next_game_tick = (new Date()).getTime();
		
		erp = ( (new Date()).getTime() + skip_ticks - next_game_tick ) / skip_ticks;
	
		stats.update(); // update stats at the same speed as the render
		render();
	}
	
	
	/*
		update game state
	*/
	function updateGame() {
		Forge.Player.update();
	}
	
	
	/*
		render scene
	*/
	function render() {
		renderer.render( scene, camera );
	}
	
	
	exports.animate = animate;
	
	exports.render = render;
	
	exports.start = start;
	
	return exports;
	
})({});