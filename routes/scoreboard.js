var express 		= require('express');
var mongoose 		= require('mongoose');
var Game 			= require('../models/game');
var async			= require('async');
var router 			= express.Router();

router.get('/game/:name', function(req, res) {

	async.series([
		/*
		 * Check if the game exists.
		 */
		function(callback) {
			Game.find({_id : req.params.name}, function(err, obj) {
				if(obj.length === 1) {
					callback(null, "Game found!");
				} else {
					callback(404, "Game not found!");
				}
			});
		}, function(callback) {
			Game.findOne({_id : req.params.name}, function(err, obj) {
				console.log(obj);
				if(obj.started === false) {
					callback(null, "Game not started yet");
				} else {
					callback(403, "Game already started!");
				}
			});
		}
	], function(err, result) {
		// 404 game found!
		// 403 game forbidden, game started!
		if (err) {
			res.status(err);
			res.json({succes:false, err:err, result:result[0]});
			process.stdout.write(['[', '✗'.red, ']', 'Couldn\'t join game [', result[0], ']'].join(' ') + '\n')
		} else {
			res.status(200);
			res.json({succes:true, err:null, result:result});
			process.stdout.write(['[', '✓'.green, ']', 'Succesfully joined a game "' + req.params.name + '"'].join(' ') + '\n');
		}
	});
});

module.exports = router;