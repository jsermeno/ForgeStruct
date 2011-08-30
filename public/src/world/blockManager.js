/*
	Static Class Block
	@author Justin Sermeno
*/
Forge.BlockManager = (function(exports){
	
  /*
    == Materials
    Block: 0 - Air
    Block: 1 - Grass
      Top:    1 - grass
      Sides:  2 - grass_dirt
      Bottom: 3 - dirt
  */
  
  var block_data = {
    0: {},  // air
    1: [    // grass
      'grass', // block name
      'assets/textures/grass.png', // top texture
      'assets/textures/grass_dirt.png', // side texture
      'assets/textures/dirt.png', // bottom texture
    ]
  };

  // To add a new block type there are 3 steps.
  // 1. Add block data to the block_data object.
  // block_data is an object with the block id as
  // the key, and an array of values as the value.
  // The array holds block_name (needs to be a valid,
  // javascript variable), top, side, and bottom
  // textures.
  // 2. Create a function to get the block material.
  // see Block.prototype.getGrass as an example.
  // 3. Add this function to this.functionlist
  // indexed by the block id in the constructor

  
  /*
    Constructor
    @param spec - data
  */
  function Block(spec) {
    // indicate if we're in worker, or clientWindow
    this.source = spec.source;
    this.materialList = {};
  
    // Map from block numbers to their function loaders
    this.functionList = {
      1: this.getGrass
    };
  
  }
  
  
  /*
    Get material based on material index
    @param index - material index listed at top of class
  */
  Block.prototype.getFaceMaterial = function( index ) {
  
    // if material hasn't been loaded yet
    // then load block materials for specified
    // index
    if ( this.materialList[ index ] === undefined ) {
     this.functionList[ ( ~~((index - 1) / 3) + 1 ) ].call(this);
    }
    
    return this.materialList[ index ];
  };
  
  
  /*
    Loads materials based on if the source is a web
    worker or a client window. This is a generic function
    that loads materials based on the block_data object
    @param blockIndex - block id specified by block_data
    object
  */
  Block.prototype.loadBlockMaterial = function( blockIndex ) {
    var block = block_data[ blockIndex ];
    var top, sides, bottom;
  
    if ( this.source === 'clientWindow' ) {
      top = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( block[1] ), wireframe: false });
      sides = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( block[2] ), wireframe: false });
      bottom = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( block[3] ), wireframe: false });
    
      this[ block[0] ] = [
        sides,
        sides,
        top,
        bottom,
        sides,
        sides
      ];
      
      this.materialList[ ((blockIndex - 1) * 3) + 1 ] = top;
      this.materialList[ ((blockIndex - 1) * 3) + 2 ] = sides;
      this.materialList[ ((blockIndex - 1) * 3) + 3 ] = bottom;
      
    } else if ( this.source === 'worker' ) {
    
      this[ block[0] ] = [
        ((blockIndex - 1) * 3) + 2,
        ((blockIndex - 1) * 3) + 2,
        ((blockIndex - 1) * 3) + 1,
        ((blockIndex - 1) * 3) + 3,
        ((blockIndex - 1) * 3) + 2,
        ((blockIndex - 1) * 3) + 2
      ];
      
    } else {
      throw new Error('block.js: loadGrass - invalid block source');
    }
  
  };
  
  
  /*
    Gets material list for a block. This is a generic function
    that gets material based on block_data object
    @param blockIndex - block id specified in the block_data
    object
  */
  Block.prototype.getMaterial = function( blockIndex ) {
    if (this[ block_data[ blockIndex ][0] ] === undefined) this.loadBlockMaterial( blockIndex );
    
    return this[ block_data[ blockIndex ][0] ];
  };
  
  
  Block.prototype.getGrass = function() { 
    return this.getMaterial( 1 );
  };
	

	return Block;
	
})({});