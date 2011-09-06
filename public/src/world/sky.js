Forge.Sky = (function(exports){

  /*
    Sky
    y axis - up and down
    x axis - -E <=> W+
    z axis - -S <=> N+
  */

  var scene;
  var camera;

  var ambientLight;
  var directionalLight;
  var pointLight;


  exports.update = function() {
    var pos = camera.position;
    var target = camera.target.position;
    
    var dir = new THREE.Vector3();
    dir.sub(target, pos);
    
    
  };
  

  /*
    initialize sky
  */
  exports.initSky = function() {
    scene = Forge.Shared.scene;
    camera = Forge.Shared.camera;
    
		scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );
		
		// Lights
		ambientLight = new THREE.AmbientLight( 0xf8f8ff );
		
		/*directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set(1, 1, 2);
		directionalLight.position.normalize();*/
				
		scene.addLight( ambientLight );
		//scene.addLight( directionalLight );
  };
  
  
  return exports;

})({});