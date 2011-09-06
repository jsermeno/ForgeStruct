/*
	Two.js
	small binary library to help things out
	@author Justin Sermeno
*/
Forge._2 = (function(exports){
	
	var startQueue = true;
	var queueCount = 0;
	
	// quick references
	var Queue = Forge.Queue;
	
	
	/*
    rapid succession ajax requests cancel older
    ajax requests, leaving only the last ajax
    request actually finishing. This ajax queue
    implementation fixes this.
    @o - ajax param object
	*/
	exports.ajaxBinaryQueue = function(o) {
    o.count = queueCount;
    queueCount++;
	
    Queue.queue('ajax', function(){
      exports.ajaxBinary(o);
    });
    //console.log('adding to queue… ' + Queue.size('ajax'));
    //console.log('queueStatus: ' + startQueue);
    if (startQueue) {
      //console.log('starting dequeue…' + ' : n - ' + o.count);
      Queue.dequeue('ajax');
    }
	};
	
	
	/*
	 	xmlHttpRequest that expects to receive an array buffer
		@param path
		@param onload
		@param params
	*/
	exports.ajaxBinary = function(o) {
    
    //console.log('starting ajax request…' + Queue.size('ajax') + ': pos - ' + JSON.stringify(o.pos) + ': n - ' + o.count);
    startQueue = false;
    
		var xhr = new XMLHttpRequest();
		
		xhr.open('GET', o.url + "/" + o.data, true);
		xhr.responseType = 'arraybuffer';
	
		xhr.onreadystatechange = function() {
		  if ( xhr.readyState === 4 ) {
		    //console.log('finishing response... : n - ' + o.count);
		    if ( xhr.status === 200 ) {
		      o.success(xhr.response);
		    } else {
		      throw new Error('_2.ajaxBinary: xhr response failed');
		    }
		    
		    startQueue = true;
		    //console.log('continuing dequeue… ' + Queue.size('ajax') + ': n - ' + o.count);
		    Queue.dequeue('ajax');
		  }
		};
		
    //console.log('sending… : n - ' + o.count);
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
    Builds neighbor hashes for a given hash
    @param hash - hash to build neighbors around
    @param object - object to add hashes to
  */
  exports.buildNeighbors = function( hash, object ) {
    var val, part, neighbor;

    // x + 1
    val = hash & 0xFF;
    part = ((hash & 0xFFFFFF00) >>> 0);

    neighbor = ((val + 1) & 0xFF) + part;

    object[ neighbor ] = 1;
    
    // x - 1
    neighbor = ((val - 1) & 0xFF) + part;

    object[ neighbor ] = 1;

    // y + 1
    val = (hash & 0xFF00) >> 8;
    part = ((hash & 0xFFFF00FF) >>> 0);
  
    neighbor = (((val + 1) & 0xFF) << 8) + part;
    
    object[ neighbor ] = 1;

    // y - 1
    neighbor = (((val - 1) & 0xFF) << 8) + part;

    object[ neighbor ] = 1;

    // z + 1
    val = (hash & 0xFF0000) >> 16;
    part = ((hash & 0xFF00FFFF) >>> 0);

    neighbor = (((val + 1) & 0xFF) << 16) + part;

    object[ neighbor ] = 1;

    // z - 1
    neighbor = (((val - 1) & 0xFF) << 16) + part;

    object[ neighbor ] = 1;
    
  };


	/*
		Builds a close proximity 4 byte hash
	*/
	exports.hash3 = function(x, y, z) {
		return (x & 0xFF) + (( y & 0xFF) << 8 ) + ((z & 0xFF) << 16) + (0xFF000000);
	};
	
	return exports;
	
})({});
