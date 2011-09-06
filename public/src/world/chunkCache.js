/*
	Abstracts retrieving and updating chunks through a cache
  chunks can be any object
	@author Justin Sermeno
*/
Forge.ChunkCache = (function(){

  var capacity = 128;
  var refreshSize = 64;


  function Cache() {
    this.cache = new Forge.OrderedMap();
  }


  Cache.prototype.load = function(x, y, z) {
    return this.cache.get( Forge._2.hash3(x, y, z) );
  }

  
  Cache.prototype.get = function(key) {
    return this.cache.get(key);
  }


  Cache.prototype.set = function(key, value) {
    this.cache.set(key, value);
  }

  
  return Cache;

})();