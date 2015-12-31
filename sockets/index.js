var io = require('socket.io')();

// Mongoose connection
var mongoose = require('mongoose');
var databaseAddr = process.env.DATABASEADDR || 'localhost';
mongoose.connect("mongodb://" + databaseAddr + ":27017/fantasy-smash-bros");

io.on('connection', function (socket) {
	//
});

// Need a websocket to listen to API container

io.listen(8001);
