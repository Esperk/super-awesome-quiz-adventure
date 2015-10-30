var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
	_id: {required: true, type: String},
	name: {type: String, required: true },
	round_points: {type: Number, default: 0}
});

var gameSchema = new Schema({
	_id: {required: true, type: String},
	stats: {
        round:  { type: Number, default: 0 },
        asked: [{ 
			type: Schema.Types.ObjectId, 
			ref: 'dbQuestions' 
		}],
        maxrounds: { type: Number, default: 3 },
        maxquestions: { type: Number, default: 12 },
        finished: {type: Boolean, default: false }
	},
	started: {type:Boolean, default: false},
	teams: [teamSchema],
	scoreboard: {type: String, default:null },
	quizmaster: {type: String, default:null },
	created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('dbGame', gameSchema);