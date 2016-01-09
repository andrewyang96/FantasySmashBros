var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var selectionSchema = new Schema({
	eventgame_doc: {type: Schema.Types.ObjectId, ref: 'EventGame'},
	selections: Schema.Types.Mixed,
	num_participants: {type: Number, default: 0},
	smashers: Schema.Types.Mixed
});

var selection = mongoose.model('Selection', selectionSchema);

module.exports = selection;
