var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: "Fantasy Smash Bros" });
});

router.get('/login', function (req, res) {
	if (req.user) return res.redirect('/dashboard');
	res.render('login', { title: "Fantasy Smash Bros Login" });
});

router.get('/calculator', function (req, res) {
	res.render('calculator', { title: "Fantasy Smash Bros Calculator", user: req.user, calculator: true });
});

router.get('/about', function (req, res) {
	res.render('about', { title: "About Fantasy Smash Bros", user: req.user, about: true });
});

router.get('/contribute', function (req, res) {
	res.render('contribute', { title: "Contribute to Fantasy Smash Bros", user: req.user, contribute: true });
});

router.get('/terms', function (req, res) {
	res.render('terms', { title: "Fantasy Smash Bros Terms & Conditions", user: req.user, terms: true });
});

router.get('/contact', function (req, res) {
	res.render('contact', { title: "Contact Info", user: req.user, contact: true });
});

router.get('/dashboard', function (req, res) {
	// TODO: must be logged in
	console.log(req.user);
	res.render('dashboard', { title: "Fantasy Smash Bros Dashboard", user: req.user, dashboard: true });
});

router.get('/settings', function (req, res) {
	// TODO: must be logged in
	res.send('here are the settings');
});

module.exports = router;
