var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventGameSchema = new Schema({
	event_doc: {type: Schema.Types.ObjectId, ref: 'Event'},
	game_name: {type: String, required: true},
	game_abbrev: {type: String, required: true},
	start_time: {type: Date, default: Date.now},
	available: {type: Boolean, default: false},
	bracket_url: {type: String},
	smashers: {type: Array}
});

var eventGame = mongoose.model('EventGame', eventGameSchema);

module.exports = eventGame;
