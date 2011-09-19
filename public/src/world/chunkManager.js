/*
  Manages queue of chunks and
  all communication between 
  web workers
*/
Forge.ChunkManager = (function(exports){

  var worker;

  exports.updateChunk = function() {
    worker.postMessage({n: 'next'});
  };

  
  /*
    Queue chunks for updating
    @param hash - hash of chunks to update
    @param pos - player position
  */
  exports.queueForUpdate = function( hash, pos ) {
    worker.postMessage({n: 'queue', hash: hash, pos: pos});
  };


  exports.spawnWorker = function() {
    worker = new Worker('/src/worker/chunkLoader.js');
  
    //worker.onmessage = exports.loadNewChunk;
    worker.addEventListener('message', exports.loadNewChunk, false);
    _WebDebug.attach(worker);
    
    return worker;
  };
  
  
  exports.loadNewChunk = function(event) {
    
    if ( event.data.p === undefined ) {
      return;
    }
    
    var geometry = Forge.Math.unserializeGeometry( event.data.d );
    var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
    
    var chunk = new Forge.Chunk({
      position: event.data.p,
      mesh: mesh
    });
    
    Forge.Shared.chunkCache.set( chunk.hash, chunk );
    Forge.World.refreshVisible();
    //console.log('adding…');
  }
  
  
  /*
    debug methods
  */
  
  exports.getVisibleCount = function() {
    worker.postMessage({n: 'debug', d: 'visibleCount'});
  }
  
  
  exports.getNotReceivedCount = function() {
    worker.postMessage({n: 'debug', d: 'notReceived'});
  }
  
  
  exports.getQueueCount = function() {
    worker.postMessage({n: 'debug', d: 'queueCount' });
  }

  
  exports.notRetrieved = function() {
    worker.postMessage({n: 'debug', d: 'notRetrieved' });
  };

  return exports;

})({});
