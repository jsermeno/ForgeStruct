importScripts('ThreeWorker.js', '../forge.js');


/*
	Manages chunk queue and processing
*/
Forge.ChunkManager = (function(exports){
	
	var queue = [];
	
	function receive(event) {
		switch ( event.data.n ) {
			case "pos": // updates position of client
				//self.postMessage("receive pos");
				break;
			case "next": // client asking to retrieve next chunk
				//self.postMessage("receive next");
				break;
		}
		
		//var geometry = new THREE.Geometry();
		//geometry.vertices = JSON.parse(testData);
		
		self.postMessage(testData);
	}
	
	
	self.onmessage = receive;
	
})({});