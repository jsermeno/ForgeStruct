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
  
    worker.onmessage = exports.loadNewChunk;
    
    return worker;
  };
  
  
  exports.loadNewChunk = function(event) {
    
    if ( event.data.p === undefined )
      return;
    
    var geometry = Forge.Math.unserializeGeometry( event.data.d );
    var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial());
    
    var chunk = new Forge.Chunk({
      position: event.data.p,
      mesh: mesh
    });
    
    Forge.Shared.chunkCache.set( chunk.hash, chunk );
    console.log('adding…');
  }

  return exports;

})({});