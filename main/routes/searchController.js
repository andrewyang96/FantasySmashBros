var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Event = require('../models/event');
var EventGame = require('../models/eventgame');

/* GET search for specified event-game. */
router.get('/:event_abbrev/:game_abbrev', function (req, res) {
	res.send('not implemented');
});

module.exports = router;
