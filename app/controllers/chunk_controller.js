var Chunk = require('../models/chunk.js');

var Compress = require('../lib/compress');

module.exports = function() {

  //var map = new Map();
	var distX = 8;
	var distY = 2;
	var distZ = 8;

  function spawn(socket) {
		var 
			map_data = "",
			chunk,
			u, v, w;
		
		/*chunk = new Chunk(0, 0, 0);
		chunk.generate();
		map_data.push(chunk.getData());*/
		
		for (u = -(distX / 2); u <= (distX / 2); u++) {
			for (v = -(distY / 2); v <= (distY / 2); v++) {
				for(w = -(distZ / 2); w <= (distZ / 2); w++) {
					chunk = new Chunk(u, v, w);
					chunk.generate();
					map_data += chunk.getData();
				}
			}
		}
		
		console.log("emitting data... " + map_data.length);
		socket.emit('chunkSpawn', map_data);
  	//socket.emit('chunkSpawn', "");
	}
  
	
	function spawnAjax(req, res) {
		var 
			map_data = "",
			chunk,
			u, v, w,
			gzip = new Compress.Gzip;
			
		gzip.init();
			
		for (u = -(distX / 2); u <= (distX / 2); u++) {
			for (v = -(distY / 2); v <= (distY / 2); v++) {
				for(w = -(distZ / 2); w <= (distZ / 2); w++) {
					chunk = new Chunk(u, v, w);
					chunk.generate();
					map_data += chunk.getData();
				}
			}
		}
		/*for (u = -1; u <= -1; u++) {
			for (v = -1; v <= 0; v++) {
				for(w = 0; w <= 0; w++) {
					chunk = new Chunk(u, v, w);
					chunk.generate();
					map_data += chunk.getData();
				}
			}
		}*/
		
		var gzData = gzip.deflate(map_data, "binary");
		gzData += gzip.end();
	
		res.header('Content-Type', 'text/plain');
		res.header('Content-Encoding', 'gzip');
		res.header('Content-Length', gzData.length );
		console.log("emitting compressed... " + map_data.length);
		
		res.write(gzData, "binary");
		res.end()
	}
	

  return {
    spawn: spawn,
		spawnAjax: spawnAjax
  };

};


// iterative approach
/*var 
  map_data = [],
  chunk,
  x, y, z;

for (x = -6; x <= 6; x++) {
  for (y = 0; y <= 0; y++) {
    for (z = -6; z <= 6; z++) {
      
        chunk = new Chunk(x, y, z);
        chunk.generate();
        socket.emit('chunkSpawn', chunk.getData());
				//map_data.push( chunk.getData() );
        //map_data.push( map.generateChunk(x, y, z) );          
    } 
  }
}

console.log("=======SPAWNING FINISHED=========: " + map_data.length);
//chunk = new Chunk(0, 0, 0);
//chunk.generate();

//return chunk.getData();
return map_data;*/