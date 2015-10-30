var expect = require('chai').expect;
var mongoose = require('mongoose');

require('./models/game');
require('./models/categories');
require('./models/questions');

var Game = mongoose.model('dbGame');
var Categorie = mongoose.model('dbCategories');
var Question = mongoose.model('dbQuestions');

before( function(done) {
    mongoose.connect('mongodb://localhost/test-quiz');
    done();
});

describe("Game object tests", function () {
	var id = "newgame";
    describe('Create and modify a new game', function () {
        it('Should save a new game', function (done) {
        	// create the mongoose object
			var newgame = new Game({_id:id});

			// save the new game!
			newgame.save(function (err, res) {
			    if (err) {
					console.log('Error: ' + err.message);
				}
				expect(res.started).to.equal(false);
				expect(res._id).to.equal(id);
				expect(res.teams.length).to.equal(0);
				expect(res.stats.maxquestions).to.equal(12);
				expect(res.stats.maxrounds).to.equal(3);
				expect(res.stats.round).to.equal(0);
				done();
			});
        });

        it('Should find 1 game', function(done) {
        	Game.find({_id : id}, function(err, res) {
        		if (err) {
					console.log('Error: ' + err.message);
				}
				expect(res.length).to.equal(1);
				done();
			});
        });

        it('Should update the max questions and max round', function(done) {
        	var maxquestions = 8;
        	var maxrounds = 2
        	Game.findOneAndUpdate( {_id: id},{'stats.maxquestions': maxquestions,'stats.maxrounds': maxrounds }, function(err, res) {
        		if (err) {
					console.log('Error: ' + err.message);
				}
				expect(res.stats.maxquestions).to.equal(maxquestions);
				expect(res.stats.maxrounds).to.equal(maxrounds);
        		done();
        	});
        });
        it('Should have no teams', function(done) {
        	var teamid = "teamawesome";
        	var team = {
        		_id: teamid
        	}
        	Game.findOne( {_id: id}, function(err, res) {
        		if (err) {
					console.log('Error: ' + err.message);
				}
				expect(res.teams.length).to.equal(0);
        		done();
        	});
        });
    });
    describe('Create and modify a new team', function () {
        it('Should add a new team', function(done) {
        	var teamid = "teamawesome";
        	var team = {
        		_id: teamid
        	}
        	Game.findOneAndUpdate( {_id: id},{$push: {teams: team}}, function(err, res) {
        		if (err) {
					console.log('Error: ' + err.message);
				}
				expect(res.teams[0]).to.exist;
        		done();
        	});
        });

        it('Should add another team', function(done) {
        	var teamid = "teamawesome2";
        	var team = {
        		_id: teamid
        	}
        	Game.findOneAndUpdate( {_id: id},{$push: {teams: team}}, function(err, res) {
        		if (err) {
					console.log('Error: ' + err.message);
				}
				expect(res.teams.length).to.equal(2);
        		done();
        	});
        });
    });
});

describe("Category tests", function () {
	it('Should add multiple categories', function(done) {
    	Categorie.create(
			{ _id: 309, name: "Random questions" }, 
			{ _id: 136, name: "stupid answers" },
			{ _id: 42, name: "sports" },
			{ _id: 21, name: "animals" },
			{ _id: 25, name: "science" },
			{ _id: 103, name: "transportation" },
			{ _id: 7, name: "u.s. cities" },
			{ _id: 253, name: "food & drink" }, function (err, res) {
				if (err) {
					console.log('new categories not saved', err);
				}
				done();
			});
    });
    it('Should find multiple categories', function(done) {
    	Categorie.find({}, function(err, res){
    		if (err) {
				console.log('Error: ', err);
			}
    		expect(res.length).to.equal(8);
    		done();
    	});
    });
    it('Should have a name and id', function(done) {
    	Categorie.findOne({}, function(err, res){
    		if (err) {
				console.log('Error: ', err);
			}
    		expect(res).to.have.property('name');
    		expect(res.name).to.be.a('string');
    		expect(res._id).to.be.a('number');
    		done();
    	});
    });
});

describe("Question tests", function () {
	it('Should add a new question', function(done) {
		Question.create({
				question: "How long is a average tree",
				answer: "7 meters",
				category_id: 7,
				categorie: 'u.s. cities'
			}, function(err, res) {
				if(err) {
    				console.log('Error: ', err);
    			}
    			done();
    		});
    });
    it('Should have a question, answer, category_id and categorie string', function(done) {
    	Question.findOne({}, function(err, res){
    		if (err) {
				console.log('Error: ', err);
			}
    		expect(res).to.have.property('question');
    		expect(res).to.have.property('answer');
    		expect(res.categorie).to.be.a('string');
    		expect(res.category_id).to.be.a('number');
    		done();
    	});
    });
});

after( function() {
    mongoose.connection.db.dropDatabase(function(err, result) {
		mongoose.connection.close();
    });
    
});

