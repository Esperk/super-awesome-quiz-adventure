var request = require('superagent');
var expect = require('expect');
var baseUrl = 'http://localhost:1337';
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Game = require('./models/game');


describe('Test quizmaster', function(){
	it ('should just add a game or somethign', function(done){
		request
		.post(baseUrl + '/quizmaster/creategame/test')
		.end(function (err, res) {
			// console.log(baseUrl + '/creategame/test');
			if (err) {
				console.log('Error: ' + err.message);
			}
			expect(res.status).to.equal(200);
			done();
		});
	});
	it ('game allready exists, expect a 409 conflict', function(done){
		request
		.post(baseUrl + '/quizmaster/creategame/test')
		.end(function (err, res) {
			// console.log(baseUrl + '/creategame/test');
			if (err) {
				console.log('Error: ' + err.message);
			}
			expect(res.status).to.equal(409);
			done();
		});
	});
});

describe('Test team apis', function(){
	// TEST TEAM APIS
	it ('game exists and can join (201)', function(done){
		request
		.get(baseUrl + '/team/game/test')
		.end(function (err, res) {
			if (err) {
				console.log('Error: ' + err.message);
			}
			expect(res.status).to.equal(201);
			done();
		});
	});
	it ('game exists and cant join (404)', function(done){
		request
		.get(baseUrl + '/team/game/tedafeaefst')
		.end(function (err, res) {
			if (err) {
				console.log('Error: ' + err.message);
			}
			expect(res.status).to.equal(404);
			done();
		});
	});
});

describe('scoreboard apis testset', function(){
	// TEST SCOREBOARD APIS
	it ('game exists and can join (201)', function(done){
		request
		.get(baseUrl + '/scoreboard/game/test')
		.end(function (err, res) {
			if (err) {
				console.log('Error: ' + err.message);
			}
			expect(res.status).to.equal(200);
			done();
		});
	});
	it ('game exists and cant join (404)', function(done){
		request
		.get(baseUrl + '/scoreboard/game/tedafeaefst')
		.end(function (err, res) {
			if (err) {
				console.log('Error: ' + err.message);
			}
			expect(res.status).to.equal(404);
			done();
		});
	});
});

