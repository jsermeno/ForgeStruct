describe("Two", function(){

  it("should give neighbors for a hash", function(){
    var hash = {};  
  
    Forge._2.buildNeighbors( 4291068138, hash );

    expect(hash).hashToContain(4291068139);
    expect(hash).hashToContain(4291068394);
    expect(hash).hashToContain(4291133674);
    expect(hash).hashToContain(4291068137);
    expect(hash).hashToContain(4291067882);
    expect(hash).hashToContain(4291002602);
  });

});