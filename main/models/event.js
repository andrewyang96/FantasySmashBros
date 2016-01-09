var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	event_name: {type: String, required: true},
	event_abbrev: {type: String, required: true, unique: true},
	event_location: {type: String},
	event_url: {type: String}
});

var event = mongoose.model('Event', eventSchema);

module.exports = event;
