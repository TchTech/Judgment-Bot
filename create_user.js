var mongoose = require('mongoose');
var models = require('./models')

export default function createUser(){
mongoose.connect('mongodb://localhost/judgment-bot-discord.users', function (err) {
    if (err) throw err;
	console.log('Successfully connected');
	
	var newUser = new models.User({
		_id: mongoose.Schema.Types.ObjectId,
	nickname: 'keklol',
	ds_id: 807560705799880774,
	falls: 0,
	conficts_member: [1],
	connected_servers: [678676786786, 567567565567, 656756],
	profile_picture: 'https://hgjhgjhgjhg.com',
	});

	newUser.save(function(err) {
		if (err) throw err;
		
		console.log('User successfully saved.');
});
})};