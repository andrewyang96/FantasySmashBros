var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Event = require('../models/event');
var EventGame = require('../models/eventgame');
var Result = require('../models/result');

/* GET all available results. */
router.get('/', function (req, res) {
	Result.find({results_ready: true}, '-_id -results_ready', function (err, results) {
		if (err) return res.status(500).send({ok: false, message: err});
		res.send({ok: true, results: results});
	});
});

/* GET availability of results for specified event-game. */
router.get('/:event_abbrev/:game_abbrev', function (req, res) {
	Event.findOne({event_abbrev: req.params.event_abbrev}, '_id', function (err, event) {
		if (err) return res.status(500).send({ok: false, message: err});
		if (!event) return res.status(400).send({ok: false, message: 'Event not found'});
		EventGame.findOne({event_doc: event._id, game_abbrev: req.params.game_abbrev}, '_id', function (err, eventgame) {
			if (err) return res.status(500).send({ok: false, message: err});
			Result.findOne({results_ready: true, eventgame_doc: eventgame._id}, '-_id', function (err, results) {
				if (err) return res.status(500).send({ok: false, message: err});
				res.send({ok: true, results: results});
			});
		});
	});
});

/* GET ranking of participants in specified event-game results sorted by score desc. */
router.get('/:event_abbrev/:game_abbrev/users', function (req, res) {
	res.send('not implemented')
});

/* GET ranking of scoring Smashers in specified event-game results by score desc (default) or place desc. */
router.get('/:event_abbrev/:game_abbrev/smashers', function (req, res) {
	res.send('not implemented');
});

module.exports = router;
