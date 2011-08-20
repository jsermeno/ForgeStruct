
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// boot
exports.boot = function( params ) {
  
  io.configure(function(){
    io.set('transports', ['xhr-polling']);  
    io.set('log level', 2);
  });

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

  bootControllers();
  bootSockets();
  
  return app;

};


function bootControllers() {
  
  // Routes
  var gameController = require('./app/controllers/game_controller.js')(app);
	var chunkController = require('./app/controllers/chunk_controller.js')(app);
	
  app.get('/', gameController.launch);
  app.get('/payload', chunkController.spawnAjax);
	app.get('/load/:data', chunkController.loadChunks);
}


function bootSockets() {

  /*var chunkController = require('./app/controllers/chunk_controller.js')(app);
  //var chunkSpawnData = chunkController.spawn();
  
	app.get('/data', chunkController.spawnAjax);

  io.sockets.on('connection', function(socket) {
   
    // Chunk controller
    socket.on('load', function(){
			chunkController.spawn(socket)
		});
    
    //socket.on('chunkLoad');    
    
    socket.on('disconnect', function(){
       delete socket.namespace.sockets[socket.id]; 
    });
  });*/

}


if (!module.parent) {
  exports.boot().listen(3000);
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}


