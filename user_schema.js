var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
	nickname: String,
	ds_id: String,
	falls: Number,
	conficts_member: Array,
	profile_picture: String,
	created: { 
		type: Date,
		default: Date.now
	}
});

module.exports = userSchema;