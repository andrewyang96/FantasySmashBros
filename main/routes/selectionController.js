var express = require('express');
var router = express.Router();

var request = require('request');
var verifyJWT = function (token, callback) {
	// Short-circuit when not in production
	if (!process.env.DATABASEADDR) return callback(null, null);

	// No token specified
	if (!token) return callback('no cookie');

	request.get({
		url: 'http://jwt:5987/verifytoken',
		qs: {token: token}
	}, function (err, response, body) {
		if (err) return res.status(500).send(err);
		if (response.statusCode == 200) {
			callback(null, {username: body});
		} else {
			callback(body);
		}
	});
};

var mongoose = require('mongoose');
var Event = require('../models/event');
var EventGame = require('../models/eventgame');
var Selection = require('../models/selection');

/* PUT (update) user's selections for event-game. */
router.put('/:event_abbrev/:game_abbrev/:username', function (req, res) {
	// Token must be sent in request body
	verifyJWT(req.body.token, function (err, decoded) {
		if (err) return res.status(401).send({ok: false, message: err});
		if (decoded.username != req.params.username) return res.status(401).send({ok: false, message: 'Username does not match'});
		res.send('token OK, not implemented');
	});
});

/* GET user's selections for event-game. */
router.get('/:event_abbrev/:game_abbrev/:username', function (req, res) {
	res.send('not implemented');
});

/* GET popularity for smashers (querystring) for event-game. */
router.get('/:event_abbrev/:game_abbrev', function (req, res) {
	res.send('not implemented');
});

module.exports = router;
