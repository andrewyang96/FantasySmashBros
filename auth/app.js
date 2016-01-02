var express = require('express');
var app = express();

// Configure cookie parser and body parser
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function (req, res, next) {
	// Enable CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Mongoose connection
var mongoose = require('mongoose');
var databaseAddr = process.env.DATABASEADDR || 'localhost';
mongoose.connect("mongodb://" + databaseAddr + ":27017/fantasy-smash-bros");

// Session config
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session); // avoid 'use of const in strict mode' errors
app.use(session({
    secret: 'fantasy-smash-bros',
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection // re-use mongoose connection
    })
}));

// Passport.js middleware config
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Passport-local config to use User model
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configure routes
var routes = require('./routes');
app.use('/', routes);

// Trust proxy
app.set('trust proxy');

module.exports = app;

// Run server
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
	console.log('Auth API listening on port ' + server.address().port);
});
