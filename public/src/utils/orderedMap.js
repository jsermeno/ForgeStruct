/*
	Ordered Map implementation
	@author Justin Sermeno
*/
Forge.OrderedMap = (function(){
	
	function OrderedMap() {
		this.order_array = [];
		this.order_map = {};
	}
	
	
	OrderedMap.prototype.set = function(key, value) {
		if ( key in this.order_map ) {
			this.order_map[key] = value;
		} 
		else {
			this.order_array.push(key);
			this.order_map[key] = value;
		}
	};
	
	
	OrderedMap.prototype.get = function(key) {
		return this.order_map[key];
	};
	
	
	OrderedMap.prototype.getIndex = function(index) {
		var hash = this.order_array[index];
		if (this.order_map[ hash ] === undefined) {
			console.log("cannot find ordered map index: " + index + " for hash: " + hash + " when array length = " + this.order_array.length);
		}
		
		return this.order_map[ this.order_array[index] ];
	};
	
	
	OrderedMap.prototype.getKeyAtIndex = function(index) {
		return this.order_array[index];
	};
	
	
  OrderedMap.prototype.contains = function(key) {
    return this.order_map[key] !== undefined;
  };
  

	OrderedMap.prototype.sort = function(sortBy) {
		var that = this;
		
		this.order_array.sort(function(a, b){
			return (function() {
				var a1 = this.order_map[a];
				var b1 = this.order_map[b];
				
				return sortBy(a1, b1);
			}).apply(that);
		});
	};
	
	
	OrderedMap.prototype.removeFirst = function() {
		var hash = this.order_array[0];
		
		this.order_array.splice(0, 1);
		delete this.order_map[hash];
	};
	
	
	OrderedMap.prototype.size = function() {
		return this.order_array.length;
	};
		
	
	OrderedMap.prototype.getArrayOfKeys = function() {
		return this.order_array;
	};
	
	OrderedMap.prototype.getHashOfKeys = function() {
		var i, len;
		var new_hash = {};
		
		for (i = 0, len = this.order_array.length; i < len; i++) {
			new_hash[this.order_array[i]] = 1;
		}
		return new_hash;
	}
	
	OrderedMap.prototype.remove = function(key) {
		var index = this.order_array.indexOf(key);
		if ( index === -1) {
			throw new Error('key does not exist');
		}
		
		this.order_array.splice(index, 1);
		delete this.order_map[key];
	}
	
	return OrderedMap;
	
})();