// server.js

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose'); //MongoDB object mapping similar to ORM 
var passport = require('passport'); // authentication abstraction layer
var flash    = require('connect-flash'); //The flash is a special area of the session used for storing messages, cleared after user display

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our MongoDB database

require('./config/passport')(passport); // pass passport object for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ secret: 'expresssessionsecret' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('The application is listening on port ' + port);
