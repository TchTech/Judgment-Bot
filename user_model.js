var mongoose = require('mongoose');
const user_schema = require('./user_schema');

var User = mongoose.model('User', user_schema);

module.exports = User;