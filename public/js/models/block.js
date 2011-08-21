/*
	Static Class Block
	@author Justin Sermeno
*/
Forge.Block = (function(){
	
	var grass_materials;
	
	function Block() {
		initMaterials();
	}
	
	
	function initMaterials() {
		// init grass
		var grass_dirt, grass, dirt;

	  grass_dirt = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("assets/textures/grass_dirt.png"), wireframe: false });
	  grass = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("assets/textures/grass.png"), wireframe: false });
	  dirt = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture("assets/textures/dirt.png"), wireframe: false });
	
		grass_materials = [
	   grass_dirt,
	   grass_dirt,
	   grass,
	   dirt,
	   grass_dirt,
	   grass_dirt
	  ];
	}
	
	
	function loadGrassMaterials() {
		return grass_materials;
	}
	
	Block();
	
	return {
		loadGrassMaterials: loadGrassMaterials
	}
	
})();