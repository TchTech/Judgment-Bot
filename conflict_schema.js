var mongoose = require('mongoose');

var conflictSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
		case: String,
		reporter: String,
		lawbreaker: String,
		punishment: String,
		guild: String,
		channel: String,
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