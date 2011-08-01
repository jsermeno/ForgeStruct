var Map = require('../models/map.js').Map;


exports.defineController = function() {

  function launch(req, res) {
    var x, y, z;
    var mapInst = new Map();
    
    // generate initial world chunks
    for( x = 0; x < 7; x++) {
      for( y = 0; y < 1; y++) {
        for( z = 0; z < 7; z++) {
          mapInst.generateChunk(x, y, z);
        }
      }
    }
    //console.log(JSON.stringify(mapInst.getAllRegions()));
    /*for(var prop in mapInst.getAllRegions()) {
      console.log(prop);
    }*/
    
    
    res.render('index', { chunk: JSON.stringify(mapInst.getAllRegions()) });
 
  }

  // Routes
  return {
    launch: launch
  };

};


