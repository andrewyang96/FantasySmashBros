var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../config.json');
var verifyJWT = function (token, callback) {
	// Short-circuit when not in production
	if (!process.env.DATABASEADDR) return callback(null, null);

	// No token specified
	if (!token) return callback('no cookie');

	jwt.verify(token, config.jwtSecret, function (err, decoded) {
		if (err) return callback('invalid token');
		callback(null, decoded);
	});
};

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: "Fantasy Smash Bros" });
});

router.get('/login', function (req, res) {
	verifyJWT(req.cookies.token, function (err) {
		if (err) {
			res.render('login', { title: "Fantasy Smash Bros Login" });
		} else {
			res.redirect('/dashboard');
		}
	});
});

router.get('/calculator', function (req, res) {
	res.render('calculator', { title: "Fantasy Smash Bros Calculator", user: null, calculator: true });
});

router.get('/about', function (req, res) {
	res.render('about', { title: "About Fantasy Smash Bros", user: null, about: true });
});

router.get('/contribute', function (req, res) {
	res.render('contribute', { title: "Contribute to Fantasy Smash Bros", user: null, contribute: true });
});

router.get('/terms', function (req, res) {
	res.render('terms', { title: "Fantasy Smash Bros Terms & Conditions", user: null, terms: true });
});

router.get('/contact', function (req, res) {
	res.render('contact', { title: "Contact Info", user: null, contact: true });
});

router.get('/dashboard', function (req, res) {
	// Must be logged in
	verifyJWT(req.cookies.token, function (err, decoded) {
		if (err) return res.redirect('/');
		res.render('dashboard', { title: "Fantasy Smash Bros Dashboard", user: decoded, dashboard: true });
	});
});

router.get('/settings', function (req, res) {
	// TODO: must be logged in
	res.send('here are the settings');
});

module.exports = router;
