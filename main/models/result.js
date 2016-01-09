var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({
	eventgame_doc: {type: Schema.Types.ObjectId, ref: 'EventGame'},
	results_ready: {type: Boolean, default: false},
	results: [String]
});

var result = mongoose.model('Result', resultSchema);

module.exports = result;
