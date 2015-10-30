var mongoose 		= require('mongoose');
var Question		= require('./models/questions');
var Categorie 		= require('./models/categories');
var async			= require('async');
var colors 			   = require('colors');
var http			=require('http');


async.waterfall([
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
	 * Empty the categories
	 */
	 function(callback) {
	 	Categorie.remove({}, function(err,removed) {
	 		if(err){
	 			console.log('somethign went wrong whem emptying database');
	 			callback(err);
	 		} else {
	 			callback();
	 			console.log('emptied' + removed +  'categories');
	 		}
	 	});
	/*
	 * import the categories
	 */
	}, function(callback) {
		// Create the categories database!
		Categorie.create(
			{ _id: 309, name: "Random questions" }, 
			{ _id: 136, name: "stupid answers" },
			{ _id: 42, name: "sports" },
			{ _id: 21, name: "animals" },
			{ _id: 25, name: "science" },
			{ _id: 103, name: "transportation" },
			{ _id: 7, name: "u.s. cities" },
			{ _id: 253, name: "food & drink" }, function (err) {
				if (err) {
					console.log('new categorie not saved');
					callback(err);
				} else {
					console.log('saved!');
					callback();
				}
			});

	// get questions!
}, function(callback) {
	var allQuestions = [];
	var categoriesDone = 0;
	Categorie.find({}, function(err, categories){
		for(var i=0; i<categories.length;i++){
			http.get('http://www.jservice.io/api/category?id='+categories[i]._id, function(res){
				var body = '';
				res.on('data', function(chunk){
					body += chunk;
				});

				res.on('end', function(){
					var questions = JSON.parse(body);
				        // console.log(questions);
				        allQuestions.push.apply(allQuestions, questions.clues);
				        console.log('push this many questions' + questions.clues.length);
				        console.log('total length:' + allQuestions.length);
				        categoriesDone++;
				        if(categoriesDone === categories.length) {
				        	console.log('done!');
				        	console.log(allQuestions.length);
				        	callback(null, allQuestions, categories);
				        }
				        
				    });
			});
		}
	});


		// save all the questions!
	}, function(questions,categories, callback) {
		console.log("Got the questions: ", questions.length);
		var questionsSaved = 0;
		callback(null, categories);
		for(var i=0; i<questions.length;i++) {
			Question.create({
				question: questions[i].question,
				answer:questions[i].answer,
				category_id:questions[i].category_id
			}, function(err) {
				if(err) {
    				// callback(err);
    			} else {
    				// console.log('new question saved!');
    				// callback();
    				questionsSaved++;
    				if(questionsSaved === questions.length) {
    					console.log('saved all the questions!');
    					callback(null, categories);
    				}
    			}
    		})
		}
		// set our categorie name!
	}, function(categories, callback) {
		namesChanged = 0;
		for(var i=0; i<categories.length;i++){
			Question.update({category_id:categories[i]._id},
							{categorie:categories[i].name},
							{multi:true}, function(err, num){
								console.log("updated: "+num);
								namesChanged++;
								if(namesChanged === categories.length){
									callback();
								}
							});
		}
		
	}
	], function(err, result) {
		if (err) {
			process.stdout.write(err.red);
		} else {
			process.stdout.write(['[', '✓'.green, ']', 'Database successfully imported'].join(' ') + '\n');
		}
	});



process.on('exit', function(code) {
	process.stdout.write(['[', '✗'.red, ']', 'Application quit [', code, ']'].join(' ') + '\n')
});