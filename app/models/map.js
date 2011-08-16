var Perlin = require('./noise.js');
var BinaryUtils = require('../lib/binaryUtils.js');

/*

    Class handles generating procedural terrain and dividing it into regions
    each region is a 16x16 area of blocks
*/


var Map = function() {

  this.regions = {};
  
  this.frequency = 0.02;
  this.amplitude = 1.0;
  this.persistence = .5;
  this.octaves = 3;

  this.CHUNK_SIZE = 32;

};


/*
    generates chunk
    @param rX - region x coordinate
    @param rY - region y coordinate
    @param rZ - region z coordinate
*/
Map.prototype.generateChunk = function( rX, rY, rZ) {
  
  var
    u, v, w, j, sU, sV, sW, data, byte, bufPos = 0;
    
  // allocate 32771 byte buffer.
  // 32x32x32 bytes + 12 bytes for region identification
  data = new Buffer(32781);
  bufPos += data.write( BinaryUtils.itoaSeq(rX), bufPos, 'binary' );
  bufPos += data.write( BinaryUtils.itoaSeq(rY), bufPos, 'binary' );
  bufPos += data.write( BinaryUtils.itoaSeq(rZ), bufPos, 'binary' );
  
  sU = rX * this.CHUNK_SIZE;
  sV = rY * this.CHUNK_SIZE;
  sW = rZ * this.CHUNK_SIZE;
  
  // Iterate for each block
  for ( u = 0; u < this.CHUNK_SIZE; u++ ) {
    for ( v = 0; v < this.CHUNK_SIZE; v++) {
      for (w = 0; w < this.CHUNK_SIZE; w++) {
        
        byte = this.threshold( this.turbulence(this.groundGradient(v + sV), (u + sU), (v + sV), (w + sW) ) ) === 1 ? String.fromCharCode(0x01) : String.fromCharCode(0x00);
        bufPos += data.write( byte, bufPos, 'binary');
           
      }
    }
  }
 
  return data.toString('binary');

}


Map.prototype.turbulence = function(t, x, y, z) {

  var 
    noise, amp, frequency, negative, resultNoise, 
    pow = 0.5,
    heightDeterminant;
  
  //heightDeterminant = (y + 1) * (1 / 16); // ( y value + 1 * (1 / half_of_maxHeight) )
  heightDeterminant = y === 0 ? 0 : 1;
  
  noise = 0;
  amp = this.amplitude;        
  frequency = this.frequency;

  for (j = 0; j < this.octaves; j++) {
    noise += Perlin.noise(x * frequency, y * frequency, z * frequency) * amp;
    frequency *= 2;
    amp *= this.persistence;
  }
  //noise += Perlin.noise(x * frequency, frequency, z * frequency) * amp;
  
  if (noise < 0) negative = true;
  
  resultNoise = Math.pow(Math.abs(noise), pow) * heightDeterminant;
  
  resultNoise = (negative === true) ? -resultNoise : resultNoise;
  negative = false;
  
  return (t) + ( resultNoise );
}


/*
    generates a smooth gradient of values between -1 and 1
    for the values between 0 and 32
*/
Map.prototype.groundGradient = function(y) {

  return (2 / this.CHUNK_SIZE) * y - 1;
  
};


Map.prototype.threshold = function(v) {

  return v <= 0 ? 1 : 0;

}


Map.prototype.getIndex = function(x, y, z) {

  return x + ( y * this.CHUNK_SIZE + z ) * this.CHUNK_SIZE;

};


Map.prototype.getRegion = function(x, y, z) {

  return this.regions[x + (y * this.CHUNK_SIZE + z) * this.CHUNK_SIZE];

};


Map.prototype.getAllRegions = function() {

  return this.regions;

};


module.exports = Map;