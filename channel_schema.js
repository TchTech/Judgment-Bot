var mongoose = require('mongoose');

var channelSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
	name: String,
	ds_id: String,
	falls: {
		type: String,
		default: "{}"
},
    scores: {
		type: String,
		default: "{}"
},
	last_season: Number,
	channel_picture: String,
	created: { 
		type: Date,
		default: Date.now
	}
});

module.exports = channelSchema;