var express 		= require('express');
var mongoose 		= require('mongoose');
var Game 			= require('../models/game');
var async			= require('async');
var router 			= express.Router();


// create a new game
router.post('/creategame/:name', function(req, res) {

	async.series([
		/*
		 * Check if the name is allready taken.
		 */
		function(callback) {
			Game.find({_id : req.params.name}, function(err, obj) {
				if(obj.length === 1) {
					callback(409, "Username was already taken");
				} else {
					callback(null, "Username is free");
				}
			});
		},

		/*
		 * Save the new game
		 */
		function(callback) {
			// create the mongoose object
			var newgame = new Game({_id:req.params.name, started:false});

			// save the new game!
			newgame.save(function (err, char) {
			    if (err) {
			    	callback(422, "Something went wrong when saving to the datbase");	
			    } else {
			    	callback(null, "Game is saved");
			    }
			});
		}
	], function(err, result) {
		// 200: ok
		// 409: Conflict.
		// 422: Aanvraag kan niet verwerkt worden.
		if (err) {
			res.status(err);
			res.json({succes:false, err:err, result:result[0]});
			process.stdout.write(['[', '✗'.red, ']', 'New game save failed quit [', result[0], ']'].join(' ') + '\n')
		} else {
			res.status(200);
			res.json({succes:true, err:null, result:result});
			process.stdout.write(['[', '✓'.green, ']', 'Succesfully saved a new game "' + req.params.name + '"'].join(' ') + '\n');
		}
	});
});

// register!
router.post('/register', function(req, res) {
	res.send('Register!!');
});

module.exports = router;