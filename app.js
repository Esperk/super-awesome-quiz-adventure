// var express            = require('express');
var mongoose		   = require('mongoose');
var path 			   = require("path");
var async			   = require('async');
var colors 			   = require('colors');
var bodyParser 		   = require('body-parser');
var express 			= require('express'),
app 				= express(),
http				= require('http'),
server 				= http.Server(app),
io 					= require('socket.io')(server);



async.series([
	/*
	 * Setup the database connection
	 */
	 function(callback) {
	 	var db = mongoose.connection;

	 	db
	 	.on('error', function(err) {
	 		process.stdout.write(['[', '✗'.red, ']', 'Database connection'].join(' ') + '\n');
	 		callback(err);
	 	})
	 	.once('open', function() {
	 		process.stdout.write(['[', '✓'.green, ']', 'Database connection'].join(' ') + '\n');
	 		callback();
	 	});

	 	mongoose.connect('mongodb://localhost/quiz');
	 },
	/*
	 * Setup the webserver
	 */
	 function(callback) {
		// Code to setup the Express app (middleware, routes) can go here. For example:
		app.use(express.static(path.join(__dirname, 'clientside')));

		// setup the body parser for reading JSON
		app.use(bodyParser.json());

		// routing:
		// Quizmaster route:
		var quizMasterRoute = require('./routes/quizmaster');
		app.use('/quizmaster/', quizMasterRoute);

		// scoreboard route:
		var scoreboardRoute = require('./routes/scoreboard');
		app.use('/scoreboard/', scoreboardRoute);

		// team route:
		var teamRoute = require('./routes/team');
		app.use('/team/', teamRoute);

		server.listen( 1337,
			function() {
				console.log("The Server is lisening on port 1337.")
			});

		callback();
	/*
	 * Setup the websockets
	 */
	}, function(callback) {
		require('./socket/socket.js')(io);

		callback();
	}
	], function(err, result) {
		if (err) {
			process.stdout.write(err.red);
		} else {
			process.stdout.write(['[', '✓'.green, ']', 'All systems up and running'].join(' ') + '\n');
		}
	});



process.on('exit', function(code) {
	process.stdout.write(['[', '✗'.red, ']', 'Application quit [', code, ']'].join(' ') + '\n')
});
// code to setup event listeners for WebSocket communication can go here

