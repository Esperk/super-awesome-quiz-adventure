var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
	question: String,
	answer: String,
	category_id: Number,
	categorie: String
});


module.exports = mongoose.model('dbQuestions', questionSchema);