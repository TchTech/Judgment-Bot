var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
_id: mongoose.Schema.Types.ObjectId,
	nickname: String,
	ds_id: Number,
	falls: Number,
	conficts_member: Array,
	connected_servers: Array,
	profile_picture: String,
	created: { 
		type: Date,
		default: Date.now
	}
});

var User = mongoose.model('User', userSchema);

var conflictSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
		case: String,
		members: Array,
		mode: String, //validator
		punishment: String,
		support_votes: Number,
		decline_votes: Number,
		judgment_date: Date,
		is_confirmed: Boolean,
		created: { 
			type: Date,
			default: Date.now
		}
	});
	
var Conflict = mongoose.model('Conflict', conflictSchema);

function createUser(){
	mongoose.connect('mongodb://localhost/judgment-bot-discord.users', function (err) {
		if (err) throw err;
		console.log('Successfully connected');
		
		var newUser = new User({
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
/*
mongoose.connect('mongodb://localhost/judgment-bot-discord', function (err) {
    if (err) throw err;
	
	console.log('Successfully connected');
	
	var jamieAuthor = new Author({
		_id: new mongoose.Types.ObjectId(),
		name: {
			firstName: 'Jamie',
			lastName: 'Munro'
		},
		biography: 'Jamie is the author of ASP.NET MVC 5 with Bootstrap and Knockout.js.',
		twitter: 'https://twitter.com/endyourif',
		facebook: 'https://www.facebook.com/End-Your-If-194251957252562/'
	});

	jamieAuthor.save(function(err) {
		if (err) throw err;
		
		console.log('Author successfully saved.');
});
});

module.exports = Author;*/