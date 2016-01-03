var express = require('express');
var app = express();
var SSE = require('sse');
var EventSource = require('eventsource');

var stringifyEvent = function (data) {
	return data.event + '/' + data.game + '/' + data.player;
};

var server = app.listen(8888, function () {
	var sse = new SSE(server);
	sse.on('connection', function (client) {
		client.send({event: 'specific'}, 'hi');
	});

	var es = new EventSource('/api/events/');
	es.onmessage = function (event) {
		// TODO: send something with sse
		console.log(event);
	}

	console.log('SSE server listening on port ' + server.address().port);
});
