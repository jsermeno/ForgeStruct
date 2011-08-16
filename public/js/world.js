/*
	World module
	@author Justin Sermeno
*/
Forge.World = function() {
	
	this.capacity = 1024;
	
	this.cache_array = [];
	this.cache_hash = {};
	
	this.render_hash = {};
	
	this.visible_array = [];
	this.visible_hash = {};
	
};


/*
	function initPayload
	Loads initial ajax chunk response into the cache
*/
Forge.World.prototype.initPayload = function( data ) {
	var 
		x, y, z,
		bufPos,
		arr,
		hash,
		chunk;
		
	bufPos = 0;
	console.log("Received Payload...");
	console.time("render");
	// Store initial payload in cache
	while (bufPos < data.byteLength - 1) {
		
		// Find region pos
		arr = new Uint8Array(data, bufPos);
		x = arr[0] << 24; x += arr[1] << 16; x += arr[2] << 8; x += arr[3];
		y = arr[4] << 24; y += arr[5] << 16; y += arr[6] << 8; y += arr[7];
		z = arr[8] << 24; z += arr[9] << 16; z += arr[10] << 8; z += arr[11];
		bufPos += 12;
		//console.log("reading... x: " + x + ", y: " + y + ", z: " + z);
		hash = this.hash3(x, y, z);
		
		this.cache_array.push(hash);
		this.cache_hash[hash] = new Uint8Array(data, bufPos, 32768);
 		
		bufPos += 32768;
		
		// Create chunk
		chunk = new Forge.Chunk(this, x, y, z);
		this.visible_array.push(hash);
		this.visible_hash[hash] = chunk;
	}

};


/*
	function initChunks
	Renders initial chunks
*/
Forge.World.prototype.initChunks = function(start) {
	var 
		that = this,
		i, len, hash, visible, visibleChunks, rendered;
	
	visible = this.visible_array;
	visibleChunks = this.visible_hash;
	len = visible.length;
	i = 0;
	
	setTimeout(buildWorld, 10);
	
	function buildWorld() {
		if (i >= len) {
			console.log("finish");
			console.timeEnd("render");
			start();
			return;
		}
			
		hash = visible[i++];
		rendered = visibleChunks[hash].render();
		
		if ( rendered !== undefined) {
			
		} else {
			that.render_hash[hash] = rendered;
		}

		setTimeout(arguments.callee, 10);
	}

};


Forge.World.prototype.getVisible = function() {
	
	
};


Forge.World.prototype.isSideVisible = function(x, y, z) {
	var block = this.getBlock(x, y, z)
	
	// if block is empty then side is visible. If block is non-existant we treat as a block and don't render the side.
	return block === 0;
};


Forge.World.prototype.getBlock = function(x, y, z) {
	var chunk_size = Forge.Config.chunk_size;
	
	var rX = x >= 0 ? ~~(x / chunk_size) : ~~((x + 1) / chunk_size) - 1;
	var rY = y >= 0 ? ~~(y / chunk_size) : ~~((y + 1) / chunk_size) - 1;
	var rZ = z >= 0 ? ~~(z / chunk_size) : ~~((z + 1) / chunk_size) - 1;
	
	var posX = x & 31;
	var posY = y & 31;
	var posZ = z & 31;
	
	var index = posZ + ( posX  * chunk_size + posY ) * chunk_size;
	
	var hash = this.hash3(rX, rY, rZ);	
	var chunkData = this.cache_hash[hash];
	
	if (chunkData === undefined) return 1;
	
	return chunkData[index];
}


Forge.World.prototype.storeVisible = function(hash, data) {
	
};

Forge.World.prototype.storeChunk = function(hash, data) {
	
};


Forge.World.prototype.hash3 = function( x, y, z ) {
	return (x & 0xFF) + (( y & 0xFF) << 8 ) + ((z & 0xFF) << 16);
};