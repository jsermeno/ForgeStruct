var Perlin = require('./noise.js');
var BinaryUtils = require('../lib/binaryUtils.js');
var fs = require('fs');

/*
    Chunk Class
    @param x, y, z - Region coordinates
*/
var Chunk = function(x, y, z) {

  this.frequency = 0.025;
  this.amp = 0.15;
  this.chunk_size = 32;
  this.terrain_max_height = 64;
	this.sample_rate = 16;
  
  this.writeStart = 12; // buf pos to start writing block data
  
  this.rX = x;
  this.rY = y;
  this.rZ = z;

  this.map_data = new Buffer(32780);
  this.map_data.write( BinaryUtils.itoaSeq(x), 0, 'binary' );
  this.map_data.write( BinaryUtils.itoaSeq(y), 4, 'binary' );
  this.map_data.write( BinaryUtils.itoaSeq(z), 8, 'binary' );

};


/*
  Generate chunk terrain
*/
Chunk.prototype.generate = function() {
  this.generateTerrain();
};


/*
  Generates base terrain
  Even though regions are infinite base terrain generation will only go up to 128 blocks high
*/
Chunk.prototype.generateTerrain = function() {
  var 
    u, v, w, byte, 
    heightMap;
  
  var sY = this.rY * this.chunk_size;
  var bufPos = this.writeStart;
  
  if ( sY > this.terrain_max_height ) {
    this.emptyChunk();
    return;
    
  } else if ( this.rY * this.chunk_size < -32 ) {
    this.fillChunk();
    return;
  }
  
  heightMap = this.generateHeightMap();
  
  for ( u = 0; u < this.chunk_size; u++ ) {
    for ( v = 0; v < this.chunk_size; v++ ) {
      for( w = 0; w < this.chunk_size; w++ ) {
				
				var blah = heightMap[u][w] * this.terrain_max_height;
	
        if ( (sY + v) < (heightMap[u][w] * this.terrain_max_height) )
          byte = String.fromCharCode(0x01);
        else
          byte = String.fromCharCode(0x00);
          
        bufPos += this.map_data.write( byte, bufPos, 'binary');
      }
    }
  }
	
};


Chunk.prototype.generateHeightMap = function() {
  var 
    u, w, 
    data = [],
    f = this.frequency,
    amp = this.amp,
		offsetU, offsetW;
  
  var sX = this.rX * this.chunk_size;
  var sZ = this.rZ * this.chunk_size;
  
  // Calculate noise at a low sample-rate
  for ( u = 0; u <= this.chunk_size; u = u + this.sample_rate ) {
  	data[u] = [];
    
    for ( w = 0; w <= this.chunk_size; w = w + this.sample_rate ) {
      data[u][w] = (Perlin.noise((sX + u) * f, f, (sZ + w) * f) * amp) + (Perlin.multiFractalNoise((sX + u) * f, f, (sZ + w) * f) * 0.1 * Perlin.rigidMultiFractalNoise((sX + u) * f, f, (sZ + w) * f) * 0.6);
    	
		}
      
  }

	var squareMinusOne = this.sample_rate - 1;

	// Do bilinear interpolation to find the missing values
	for ( u = 0; u < this.chunk_size; u++ ) {
		if (data[u] === undefined) 
			data[u] = [];
		
		for ( w = 0; w < this.chunk_size; w++ ) {
			if ( !((u & squareMinusOne) == 0 && (w & squareMinusOne) == 0) ) {

				offsetU = ~~( u / this.sample_rate ) * this.sample_rate;
				offsetW = ~~( w / this.sample_rate ) * this.sample_rate;
				
				data[u][w] = Perlin.biLerp((w & squareMinusOne) / this.sample_rate, (u & squareMinusOne) / this.sample_rate, data[offsetU + this.sample_rate][offsetW], data[offsetU + this.sample_rate][offsetW + this.sample_rate], data[offsetU][offsetW], data[offsetU][offsetW + this.sample_rate]);
			}
		}
	}
  
  return data;
};


Chunk.prototype.emptyChunk = function() {
  var 
    u, v, w,
    bufPos = this.writeStart;

  for ( u = 0; u < this.chunk_size; u++ ) {
    for ( v = 0; v < this.chunk_size; v++) {
      for (w = 0; w < this.chunk_size; w++) {
        
        bufPos += this.map_data.write( String.fromCharCode(0x00), bufPos, 'binary');
           
      }
    }
  }
  
};


Chunk.prototype.fillChunk = function() {
  var 
    u, v, w,
    bufPos = this.writeStart;

  for ( u = 0; u < this.chunk_size; u++ ) {
    for ( v = 0; v < this.chunk_size; v++) {
      for (w = 0; w < this.chunk_size; w++) {
        
        bufPos += this.map_data.write( String.fromCharCode(0x01), bufPos, 'binary');
           
      }
    }
  }

};


Chunk.prototype.getData = function() {
	//fs.writeFile('binaryData.map', this.map_data, 0, this.map_data.length, 0, function(err, writte, buffer){
	/*fs.writeFile('binaryData.map', this.map_data, function(err){
		if (err) console.log("error");
		console.log("success");
	});*/
	
  return this.map_data.toString('binary');
};



module.exports = Chunk;