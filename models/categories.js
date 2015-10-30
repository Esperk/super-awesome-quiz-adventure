var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorieSchema = new Schema({
	_id: Number,
	name: String
});

module.exports = mongoose.model('dbCategories', categorieSchema);