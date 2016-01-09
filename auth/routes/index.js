var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var User = require('../models/user');

// Configuration variables
var config = require('../config.json');

// Rate limiter config
var RateLimiter = require('limiter').RateLimiter;
var loginLimiter = new RateLimiter(2, 'second');

// Recaptcha config
var recaptcha = function (req, res, callback) {
	// Short-circuit if not in production
	if (!process.env.DATABASEADDR) return callback('{"success":true}');

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
							var message;
							if (err.code == 11000) {
								message = "A user with the given email address is already registered";
							} else {
								message = err.message;
							}
							res.json({success: false, message: message});
						} else {
							// Success
							res.json({success: true, 'Location': '/login'});
						}
					});
				} else {
					res.json({success: false, message: "Username must be specified."});
				}
			} else {
				res.json({success: false, message: "The agree checkbox wasn't checked."});
			}
		} else {
			var errorCodes = response['error-codes'];
			res.json({success: false, message: "Recaptcha check error: " + errorCodes});
		}
	});
});

// LOGIN a user
router.post('/login', function (req, res, next) {
	passport.authenticate('local', { session: false }, function (err, user, info) {
		if (err) return next(err);
		if (!user) return res.json({success: false, message: 'Incorrect credentials'});

		request.get({
			url: "http://jwt:5987/issuetoken",
			qs: {username: user.username}
		}, function (err, response, body) {
			if (err) return res.status(500).send(err);
			if (response.statusCode == 200) {
				res.json({success: true, token: body, 'Location': '/dashboard'});
			} else {
				res.json({success: false});
			}
		});
	})(req, res, next);
});

// LOGOUT a user
router.get('/logout', function (req, res) {
	res.send(
		"<p>Redirecting to <a href='/'>/</a>" + 
		"<script>" + 
		"document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';" + // <-- doesn't work?
		"window.localStorage.removeItem('token');" + 
		"window.location.pathname = '/';" + 
		"</script>"
	);
});

// SEND forgot password email
router.post('/forgotpassword', function (req, res) {
	res.send('forgot password');
});

module.exports = router;
