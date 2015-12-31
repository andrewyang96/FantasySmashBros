var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: "Fantasy Smash Bros" });
});

router.get('/login', function (req, res) {
	res.render('login', { title: "Fantasy Smash Bros Login" });
});

router.get('/calculator', function (req, res) {
	res.render('calculator', { title: "Fantasy Smash Bros Calculator" });
});

router.get('/about', function (req, res) {
	res.render('about', { title: "About Fantasy Smash Bros" });
});

router.get('/contribute', function (req, res) {
	res.render('contribute', { title: "Contribute to Fantasy Smash Bros" });
});

router.get('/terms', function (req, res) {
	res.render('terms', { title: "Fantasy Smash Bros Terms & Conditions" });
});

router.get('/contact', function (req, res) {
	res.render('contact', { title: "Contact Info" });
});

module.exports = router;
