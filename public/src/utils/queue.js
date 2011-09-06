Forge.Queue = (function(exports){

  var queues = {};

  exports.queue = function(name, fn) {
    if ( queues[name] === undefined ) {
      queues[name] = [];
    }
    
    if ( typeof fn === 'function' )
      queues[name].push(fn);
    else
      return queues[name];
      
  };
  
  
  exports.dequeue = function(name) {
    var fn = queues[name].shift();
    
    if ( typeof fn === 'function') {
      fn();
    }
  };
  
  
  exports.size = function(name) {
    return queues[name].length;
  }
  
  
  exports.getQueues = function() {
    return queues;
  };
  
  return exports;

})({});