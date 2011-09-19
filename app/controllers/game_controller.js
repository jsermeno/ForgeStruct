
module.exports = function(app) {

  function launch(req, res) {
    console.log(app.set('environmentName'));

    res.render('index', {
      env: app.set('environmentName')
    });
  }

  // Routes
  return {
    launch: launch
  };

};


