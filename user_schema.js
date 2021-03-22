var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
	nickname: String,
	ds_id: mongoose.Schema.Types.Decimal128,
	falls: Number,
	conficts_member: Array,
	connected_servers: Array,
	profile_picture: String,
	created: { 
		type: Date,
		default: Date.now
	}
});

module.exports = userSchema;