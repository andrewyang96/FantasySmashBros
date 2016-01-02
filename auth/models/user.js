var mongoose = require('mongoose');
var validator = require('validator');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	email: {type: String, required: true, validate: [validator.isEmail, 'Invalid email']},
	verified: {type: Boolean, default: false},
	banned: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);
var user = mongoose.model('User', userSchema);

module.exports = user;
