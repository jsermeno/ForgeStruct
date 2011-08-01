var Perlin = require('./noise.js').Noise;

/*

    Class handles generating procedural terrain and dividing it into regions
    each region is a 16x16 area of blocks
*/


var Map = function() {

  this.regions = {};
  
  this.frequency = 0.015;
  this.amplitude = 1.0;
  this.persistence = 0.9;
  this.octaves = 2;

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
    u, v, w, j, sU, sV, sW, data;
    
  data = [];
  
  sU = rX * this.CHUNK_SIZE;
  sV = rY * this.CHUNK_SIZE;
  sW = rZ * this.CHUNK_SIZE;
  
  // Iterate for each block
  for ( u = 0; u < this.CHUNK_SIZE; u++ ) {
    for ( v = 0; v < this.CHUNK_SIZE; v++) {
      for (w = 0; w < this.CHUNK_SIZE; w++) {
        data[ this.getIndex(u, v, w) ] = this.threshold( this.turbulence(this.groundGradient(v + sV), (u + sU), (v + sV), (w + sW) ) );    
      }
    }
  }
  
  this.regions[ this.getIndex(rX, rY, rZ) ] = data;

}


Map.prototype.turbulence = function(t, x, y, z) {

  var 
    noise, amp, frequency, negative, resultNoise, 
    pow = 0.5,
    heightLimiter,
    heightDeterminant;
  
  heightLimiter = 0.23;
  //heightDeterminant = (y + 1) * (1 / 8); // ( y value + 1 * (1 / half_of_maxHeight) )
  heightDeterminant = y === 0 ? 0 : 1;
  
  noise = 0;
  amp = this.amplitude;        
  frequency = this.frequency;

  for (j = 0; j < this.octaves; j++) {
    noise += Perlin.noise(x * frequency, y * frequency, z* frequency) * amp;
    frequency *= 2;
    amp *= this.persistence;
  }
  
  if (noise < 0) negative = true;
  
  resultNoise = Math.pow(Math.abs(noise), pow) * heightDeterminant;
  
  resultNoise = (negative === true) ? -resultNoise : resultNoise;
  negative = false;
  
  return (t) + ( resultNoise );
}


/*
    generates a smooth gradient of values between -1 and 1
    for the values between 0 and 54
*/
Map.prototype.groundGradient = function(y) {

  return (2 / this.CHUNK_SIZE) * y - 1;
  
};


Map.prototype.threshold = function(v) {

  return v <= 0 ? 1 : -1;

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


exports.Map = Map;