var express = require('express');
var app = express();
var request = require('request');

app.get('/', function (req, res) {
    res.send('Fantasy Smash Bros API Gateway');
});

var availableApis = {
	'scoring': 5000
};

app.get('/*/*', function (req, res, next) {
	var whichApi = req.params[0];
	if (whichApi in availableApis) {
		var path = req.params[1];
		var destPort = availableApis[whichApi];
		request.get({
			url: "http://" + whichApi + ":" + destPort + "/" + path,
			qs: req.query
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
