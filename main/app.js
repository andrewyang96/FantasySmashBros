var express = require('express');
var app = express();

// Configure cookie parser and body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	// Enable CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Mongoose connection
var mongoose = require('mongoose');
var databaseAddr = process.env.DATABASEADDR || 'localhost';
mongoose.connect("mongodb://" + databaseAddr + ":27017/fantasy-smash-bros");

// Configure routes
var eventController = require('./routes/eventController');
var resultController = require('./routes/resultController');
var searchController = require('./routes/searchController');
var selectionController = require('./routes/selectionController');
app.use('/events', eventController);
app.use('/results', resultController);
app.use('/search', searchController);
app.use('/select', selectionController);

// Trust proxy
app.set('trust proxy');

module.exports = app;

// Run server
app.set('port', process.env.PORT || 8000);
var server = app.listen(app.get('port'), function () {
	console.log('Main API listening on port ' + server.address().port);
});
