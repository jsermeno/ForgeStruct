
/*

  Utility class with static methods for doing binary related stuff
  
*/

var BinaryUtils = (function() {


  // Converts an integer to a 4 byte character sequence for writing to a binary Buffer object
  // param n - integer to convert
  // returns - a 4 byte character sequence to writing to binary
  function itoaSeq(n) {
    var
      result = "",
      hex; 
    
    hex = (n & 0xFF000000) >> 24;
    result += String.fromCharCode(hex);
  
    hex = (n & 0x00FF0000) >> 16;
    result += String.fromCharCode(hex);
    
    hex = (n & 0x0000FF00) >> 8;
    result += String.fromCharCode(hex);
    
    hex = (n & 0x000000FF);
    result += String.fromCharCode(hex);
  
    return result;
  }
  

  return {
    itoaSeq: itoaSeq
  };

})();


module.exports = BinaryUtils;