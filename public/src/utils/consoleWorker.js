(function(exports) {

  var Debug = {};

  if ( typeof window === 'undefined') {
    // we're inside a web worker
    self['console'] = Debug;
    
    Debug.log = function(msg) {
      self.postMessage({m: msg, debug: true});
    }
  } else {
    window['_WebDebug'] = Debug;
    
    Debug.attach = function(worker) {
      var orig = worker.onmessage;
      
      if ( typeof orig === 'function' ) {
        
        worker.onmessage = function(e) {
          Debug.handleMsg(e);
          orig(e);
        }
        
      } else {
        worker.addEventListener('message', Debug.handleMsg, false);
      }
    }
    
    Debug.handleMsg = function(e) {
      if (event.data.debug === true) {
        console.log(event.data.m);
      }
    }
  }

})({});