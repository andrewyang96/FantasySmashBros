var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var User = require('../models/user');

// Rate limiter config
var RateLimiter = require('limiter').RateLimiter;
var loginLimiter = new RateLimiter(2, 'second');

// Recaptcha secret config
var config = require('../config.json');

// Recaptcha config
var recaptcha = function (req, res, callback) {
	var grRes = req.body["g-recaptcha-response"];
	var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + config.recaptchaSecret + "&response=" + grRes + "&remoteip=" + req.connection.remoteAddress;
	request.post(url, function (err, httpResponse, body) {
		if (err) {
			res.status(400).send("Error in recaptcha: " + err);
		} else {
			callback(body);
		}
	});
};

router.get('/', function (req, res) {
	res.send('hi');
});

// REGISTER new user
router.post('/register', function (req, res) {
	recaptcha(req, res, function (response) {
		response = JSON.parse(response);
		if (response.success) {
			// Check for agree checkbox
			if (req.body.agree) {
				if (req.body.username) {
					User.register(new User({
						email: req.body.email,
						username: req.body.username
					}), req.body.password, function (err, account) {
						if (err) {
							// console.log(err);
							res.status(500).send("Error registering account");
						} else {
							// Success
							res.redirect('/dashboard');
						}
					});
				} else {
					res.status(400).send("Username must be specified.");
				}
			} else {
				res.status(400).send("The agree checkbox wasn't checked.");
			}
		} else {
			var errorCodes = response['error-codes'];
			res.status(400).send("User registration failed: " + errorCodes);
		}
	});
});

// LOGIN a user
router.post('/login', passport.authenticate('local'), function (req, res) {
	// req.user contains user information
	res.redirect('/dashboard');
});

// LOGOUT a user
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// SEND forgot password email
router.post('/forgotpassword', function (req, res) {
	res.send('forgot password');
});

module.exports = router;
