var Chunk = require('../models/chunk.js');

var BlockUtils = require('../lib/blockUtils.js');
var Compress = require('../lib/compress');

module.exports = function() {

	var distX = 2;
	var distY = 2;
	var distZ = 2;

	function loadChunks(req, res) {
					
		var
			u, v, w,
			chunk
			map_data = "";
			
		var data, pos, visible;
		
		try {
			
			// Attempt to parse json parameters
			data = JSON.parse(req.params.data);
			pos = data.pos;
			visible = data.visible;
			
		} catch (e) {
			
			console.log("loadChunks: error" + e);
			res.end();
			return;
			
		}
		//console.log(pos);
		//console.log(visible);
		var 
			radiusX = (distX / 2),
			radiusY = (distY / 2),
			radiusZ = (distZ / 2);
			
		var gzip = new Compress.Gzip;
		gzip.init();
		var count = 0;
		// Loop through possible chunks
		for ( u = pos.x - radiusX; u <= pos.x + radiusX; u++) {
			for ( v = pos.y - radiusY; v <= pos.y + radiusY; v++) {
				for ( w = pos.z - radiusZ; w <= pos.z + radiusZ; w++) {
					chunk = new Chunk(u, v, w);
					
					// Build chunk if it's not already in the visible hash
					if ( visible[chunk.getHash()] === undefined ) {
						chunk.generate();
						map_data += chunk.getData();
					} else {
						count++;
						map_data += chunk.getHashData();
					}
				}
			}
		}
		console.log(count + " chunks are already visible");
		// Compress and send data
		var gzData = gzip.deflate(map_data, "binary");
		gzData += gzip.end();
	
		res.header('Content-Type', 'text/plain');
		res.header('Content-Encoding', 'gzip');
		res.header('Content-Length', gzData.length );
		console.log("emitting compressed... " + map_data.length);
		
		res.write(gzData, "binary");
		res.end();
		
	}
	

  return {
		loadChunks: loadChunks
  };

};