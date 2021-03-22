var mongoose = require('mongoose');

var conflictSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
		case: String,
		reporter: mongoose.Schema.Types.Decimal128,
		lawbreaker: mongoose.Schema.Types.Decimal128,
		punishment: String,
		support_votes: Number,
		decline_votes: Number,
		judgment_date: Date,
		is_confirmed: String,
		created: { 
			type: Date,
			default: Date.now()
		}
});
module.exports = conflictSchema