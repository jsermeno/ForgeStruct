Forge.Sky = (function(exports){

  /*
    Sky
    y axis - up and down
    x axis - -E <=> W+
    z axis - -S <=> N+
  */

  var scene;
  var camera;
  var projector;

  var ambientLight;
  var directionalLight;
  var pointLight;
  
  var skyNormal = new THREE.Vector3(0, 1, 0); // up
  var dayInterval = 65535; // milliseconds, 2^17 - 1 (~2 minutes)
  
  var skyObj = { dark: '7393F2', light: '8CBAFF'};
  var skyTween;
  
  // Sun
  var sunPos3D = new THREE.Vector3(5000, 0, 0);
  
  // test
  var mesh;
  
  exports.update = function() {
    var gradObj, sunObj;
  
    gradObj = calculateSkyGradient();
    sunObj = calculateSunPosition();
    
    // update sky gradient
    if ( Forge.Shared.GUI.sky ) {
      TWEEN.update();
      document.body.style.background = "\
        -webkit-gradient(radial, "+ sunObj.x + "% " + sunObj.y + "%, 50, " + sunObj.x + "% " + sunObj.y + "%, 150, from(#ffffff), to(rgba(251, 230, 180, 0.0))),\
        -webkit-linear-gradient(top, #" + skyObj.dark + " 0%,#" + skyObj.dark + " " + gradObj.g1 + "%,#" + skyObj.light + " " + gradObj.g2 + "%,#" + skyObj.light + " 100%)";
    }

  };
  

  /*
    initialize sky
  */
  exports.initSky = function() {
    scene = Forge.Shared.scene;
    camera = Forge.Shared.camera;
    projector = Forge.Shared.projector;
    
    Forge.Shared.GUI.sky = false;

		scene.fog = new THREE.FogExp2( 0xffffff, 0.00015 );
		
		// Lights
		ambientLight = new THREE.AmbientLight( 0xf1f1b4 );
		
		directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set(1, 1, 2);
		directionalLight.position.normalize();
				
		scene.addLight( ambientLight );
		scene.addLight( directionalLight );
		
		// initialize sky tweens
    calculateSkyColor();
		
  };
  
  
  function calculateSkyGradient() {
    var theta, g1, g2;

    // find camera directional vector
    var dir = new THREE.Vector3();
    dir.sub(camera.target.position, camera.position);
    
    // find angle between sky normal and
    // directional vector as cos(theta)
    // A*B = |A||B|cos(theta)
    theta = dir.dot( skyNormal ) / ( dir.length() * skyNormal.length() );
    
    g1 = (100 * theta) - 25;
    g2 = g1 + 40;
    
    g1 = g1 < 0 ? 0 : g1;
    g2 = g2 < 0 ? 0 : g2;
    
    return { g1: g1, g2: g2};
  }
  
  
  function calculateSunPosition() {
    var 
      dayOffset, theta, rotateMatrix, sunPos2D;
    
    // calculate day offset
    dayOffset = (new Date()).getTime() & dayInterval;
    theta = (Math.PI * 2) * (dayOffset / dayInterval);

    sunPos3D.z = camera.position.z;

    // create rotation matrix
    rotateMatrix = new THREE.Matrix4(Math.cos(theta), -Math.sin(theta), 0, 0,
                                         Math.sin(theta), Math.cos(theta), 0, 0,
                                         0, 0, 1, 0,
                                         0, 0, 0, 1 );
    
    // calculate rotation            
    sunPos2D = rotateMatrix.multiplyVector3( sunPos3D.clone() );
    
    // project to 2D
    sunPos2D = projector.projectVector(sunPos2D, camera);
    
    // translate from NDC to screen coordinates
    sunPos2D.x = ((sunPos2D.x + 1) / 2);
    sunPos2D.y = ((sunPos2D.y - 1) / -2);
   
    // off of the screen
    sunPos2D.x = sunPos2D.z > 1 ? -2 : sunPos2D.x;
    sunPos2D.y = sunPos2D.z > 1 ? -2 : sunPos2D.y;

    // calculate percentages 
    sunPos2D.x *= 100;
    sunPos2D.y *= 100;
    
    return sunPos2D;
  }
  
  
  function calculateSkyColor() {
    // calculate day offset
    var currTime;
    var dayOffset = ((new Date()).getTime() & dayInterval);
  
  	// Color values at each point in the day
    var start = {
      dark: new THREE.Color(0x7393F2),
      light: new THREE.Color(0x8CBAFF),
      ambient: new THREE.Color(0xf1f1b4)
    },
    day = {
      dark: new THREE.Color(0x7393F2),
      light: new THREE.Color(0x8CBAFF),
      ambient: new THREE.Color(0xf1f1b4)
    },
    sunset = {
      dark: new THREE.Color(0xD58C7D),
      light: new THREE.Color(0xFFA069),
      ambient: new THREE.Color(0xD58C7D)
    },
    night = {
      dark: new THREE.Color(0x17172F),
      light: new THREE.Color(0x1E415F),
      ambient: new THREE.Color(0x17172F)
    };
      
    var currentColor = new THREE.Color(0x000000);
    
    // Sky update functions
    var sky_update = {
    	dark: function() {
	      currentColor.setRGB( this.r, this.g, this.b );
	      skyObj.dark = currentColor.getHex().toString(16);
	    },
    	light: function() {
	      currentColor.setRGB( this.r, this.g, this.b );
	      skyObj.light = currentColor.getHex().toString(16);
	    },
    	ambient: function() {
	      ambientLight.color.setRGB( this.r, this.g, this.b );
	    }
    };
    
    // Day/Night cycle
    // Starts at theta = 0 at day break
    // Ends at theta = 2PI at day break
    // There are three levels of animation
    // Sky dark gradient color,
    // Sky light gradient color,
    // And the sky ambient light color
    
    var tweens = {};
  	var type;
  
  	for ( type in sky_update) {
	  	tweens['dayBreak_' + type] = 	new TWEEN.Tween(start[type])		// from sunset to day color
	    																.to(day[type], dayInterval * (2/24))
	    																.onUpdate(sky_update[type]);
	    
	    tweens['sunset_' + type] = 		new TWEEN.Tween(start[type])			// from day color to sunset color
	    																.to(sunset[type], dayInterval * (2/24))
	    																.delay(dayInterval * (8/24))
	    																.onUpdate(sky_update[type]);
	    												
	    tweens['nightfall_' + type] = new TWEEN.Tween(start[type])	// from sunset color to night fall
	    																.to(night[type], dayInterval * (2/24))
	    																.onUpdate(sky_update[type]);
	    													
	    tweens['dawn_' + type] = 			new TWEEN.Tween(start[type])				// from night color to sunset color
	    																.to(sunset[type], dayInterval * (2/24))
	    																.delay(dayInterval * (8/24))
	    																.onUpdate(sky_update[type]);
	    													
	    tweens['dayBreak_' + type].chain(tweens['sunset_' + type]);
	    tweens['sunset_' + type].chain(tweens['nightfall_' + type]);
	    tweens['nightfall_' + type].chain(tweens['dawn_' + type]);
	    tweens['dawn_' + type].chain(tweens['dayBreak_' + type]);
    }
    
    currTime = (new Date()).getTime() - dayOffset;
    
    for ( type in sky_update ) {
    	tweens['dayBreak_' + type].start(currTime);
    }
    
  }
    
  
  return exports;

})({});
