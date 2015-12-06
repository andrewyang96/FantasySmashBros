var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: "Fantasy Smash Bros" });
});

router.get('/login', function (req, res) {
	if (req.cookies.authData) {
		var token = JSON.parse(req.cookies.authData).token;
		ref.authWithCustomToken(token, function (error, authData) {
			if (error) {
				// Remove cookie
				res.writeHead(200, { "Set-Cookie": "authData=null; expires=Thu, 01 Jan 1970 00:00:00 GMT" });
				res.render('login', { title: "Fantasy Smash Bros Login" });
			} else {
				// Redirect to dashboard
				res.redirect('/play');
			}
		});
	} else {
		res.render('login', { title: "Fantasy Smash Bros Login" });
	}
});

router.get('/flairs', function (req, res) {
	res.render('flairs', { title: "Fantasy Smash Bros Flairs" });
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
