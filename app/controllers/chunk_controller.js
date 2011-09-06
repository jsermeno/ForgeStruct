var Chunk = require('../models/chunk.js');
var Compress = require('../lib/compress');

module.exports = function() {

  var
    radiusX = (10 / 2),
		radiusY = (4 / 2),
		radiusZ = (10 / 2);


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
						to_update[ chunk.getHash() ] = 0;
					}

				}
			}
		}
		
		for ( var key in to_update ) {
		  if (to_update[key] !== 0) {
		    console.log('error: did not update chunks');
		    console.log(JSON.stringify(to_update));
		    break;
		  }
		}
		
		// Compress and send data
		var gzData = gzip.deflate(map_data, "binary");
		gzData += gzip.end();
	
		res.header('Content-Type', 'text/plain');
		res.header('Content-Encoding', 'gzip');
		res.header('Content-Length', gzData.length );
		//console.log(((new Date()).getTime()) + ": update_hash - " + JSON.stringify(to_update) + ": pos - " + JSON.stringify(pos));
		console.log("emitting compressed... " + map_data.length + ": - pos - " + JSON.stringify(pos));
		
		res.write(gzData, "binary");
		console.log('sending…');
		res.end();
		console.log('ending…');
	}
	

  return {
		loadChunks: loadChunks
  };

};