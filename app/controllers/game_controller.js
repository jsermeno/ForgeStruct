
module.exports = function() {

  function launch(req, res) {
    res.render('index');
  }

  // Routes
  return {
    launch: launch
  };

};


