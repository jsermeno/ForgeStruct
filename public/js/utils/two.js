/*
	Two.js
	small binary library to help things out
	@author Justin Sermeno
*/
Forge._2 = (function(exports){
	
	/*
	 	xmlHttpRequest that expects to receive an array buffer
		@param path
		@param onload
		@param params
	*/
	exports.ajaxBinary = function(path, onload, params) {
		
		var xhr = new XMLHttpRequest();
		
		xhr.open('GET', path + "/" + params, true);
		xhr.responseType = 'arraybuffer';
	
		xhr.onload = onload;
	
		xhr.send(null);
	};
	
	
	/*
		returns an object of 3D coordinates.
		Expects an ArrayBuffer with at least 12 bytes
	*/
	exports.getCoordinates = function(buf, bufPos) {
		var coor = {};
		var x, y, z;
		
		var arr = new Uint8Array(buf, bufPos, 12);
		
		x = (arr[0] << 24); x += arr[1] << 16; x += arr[2] << 8; x += arr[3];
		y = (arr[4] << 24); y += arr[5] << 16; y += arr[6] << 8; y += arr[7];
		z = (arr[8] << 24); z += arr[9] << 16; z += arr[10] << 8; z += arr[11];
		
		coor.x = x; coor.y = y; coor.z = z;
		
		return coor;
	};
	
	
	/*
		Builds a close proximity 4 byte hash
	*/
	exports.hash3 = function(x, y, z) {
		return (x & 0xFF) + (( y & 0xFF) << 8 ) + ((z & 0xFF) << 16) + (0xFF000000);
	};
	
	return exports;
	
})({});
