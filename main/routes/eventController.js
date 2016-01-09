var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Event = require('../models/event');
var EventGame = require('../models/eventgame');

/* GET all available events. */
router.get('/', function (req, res) {
	Event.find({}, 'event_name event_abbrev', function (err, events) {
		if (err) return res.status(500).send({ok: false, message: err});
		res.send({ok: true, events: events});
	});
});

/* GET available games for specified event. */
router.get('/:event_abbrev', function (req, res) {
	Event.findOne({event_abbrev: req.params.event_abbrev}, '_id', function (err, event) {
		if (err) return res.status(500).send({ok: false, message: err});
		if (!event) return res.status(400).send({ok: false, message: 'Event not found'});
		EventGame.find({event_doc: event._id}, 'game_name game_abbrev start_time available event_location event_url bracket_url smashers', function (err, eventgames) {
			if (err) return res.status(500).send({ok: false, message: err});
			res.send({ok: true, eventgames: eventgames});
		});
	});
});

/* GET info for event-game combination. */
router.get('/:event_abbrev/:game_abbrev', function (req, res) {
	Event.findOne({event_abbrev: req.params.event_abbrev}, '_id', function (err, event) {
		if (err) return res.status(500).send({ok: false, message: err});
		if (!event) return res.status(400).send({ok: false, message: 'Event not found'});
		EventGame.findOne({event_doc: event._id, game_abbrev: req.params.game_abbrev}, 'game_name game_abbrev start_time available event_location event_url bracket_url smashers', function (err, eventgame) {
			if (err) return res.status(500).send({ok: false, message: err});
			res.send({ok: true, eventgame: eventgame});
		});
	});
});

module.exports = router;
