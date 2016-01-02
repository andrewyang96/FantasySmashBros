var express = require('express');
var app = express();
var request = require('request');

// Configure cookie parser and body parser
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.raw({type: '*/*'}));
app.use(cookieParser());

app.use(function(req, res, next) {
	// Enable CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function (req, res) {
    res.send('Fantasy Smash Bros API Gateway');
});

var availableApis = {
	'scoring': 5000,
	'auth': 3000
};

app.get('/api/*/*', function (req, res, next) {
	var whichApi = req.params[0];
	if (whichApi in availableApis) {
		var path = req.params[1];
		var destPort = availableApis[whichApi];
		request.get({
			url: "http://" + whichApi + ":" + destPort + "/" + path,
			qs: req.query,
			headers: req.headers
		}, function (err, response, body) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(response.statusCode).send(body);
			}
		});
	} else {
		next();
	}
});

app.post('/api/*/*', function (req, res, next) {
	var whichApi = req.params[0];
	if (whichApi in availableApis) {
		var path = req.params[1];
		var destPort = availableApis[whichApi];
		request.post({
			url: "http://" + whichApi + ":" + destPort + "/" + path,
			qs: req.query,
			body: req.body,
			headers: req.headers
		}, function (err, response, body) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(response.statusCode).send(body);
			}
		});
	} else {
		next();
	}
});

var server = app.listen(4747, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("API gateway Listening at http://%s:%s", host, port);
});
