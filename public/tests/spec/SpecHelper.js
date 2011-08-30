beforeEach(function() {
  this.addMatchers({
    hashToContain: function(hash) {
      return this.actual[ hash ] !== undefined;
    }
  });
});
