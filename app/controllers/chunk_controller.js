var Chunk = require('../models/chunk.js');
var Compress = require('../lib/compress');

module.exports = function() {

  var
    radiusX = (4 / 2),
		radiusY = (4 / 2),
		radiusZ = (4 / 2);


	function loadChunks(req, res) {
		var
			u, v, w,
			chunk
			map_data = "";
			
		var data, pos, to_update;
	
		try {
			
			// Attempt to parse json parameters
			data = JSON.parse(req.params.data);
			pos = data.p;
			to_update = data.h;
			
		} catch (e) {
			
			console.log("loadChunks: error" + e);
			res.end();
			return;
			
		}
			
		var gzip = new Compress.Gzip;
		gzip.init();
  
		// Loop through possible chunks
		for ( u = pos.x - radiusX; u <= pos.x + radiusX; u++) {
			for ( v = pos.y - radiusY; v <= pos.y + radiusY; v++) {
				for ( w = pos.z - radiusZ; w <= pos.z + radiusZ; w++) {
					chunk = new Chunk(u, v, w);
					
					// Build chunk only if it's specified in
          // the to_update hash
					if ( to_update[ chunk.getHash() ] !== undefined ) {
						chunk.generate();
						map_data += chunk.getData();
					} else {
						//map_data += chunk.getHashData();
					}

				}
			}
		}
		
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