
/**
 * Module dependencies.
 */

var express = require('express');
var gameController = require('./app/controllers/game_controller.js').defineController();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', gameController.launch);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
