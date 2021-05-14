var mongoose = require('mongoose');
const channel_schema = require('./channel_schema');

var Channel = mongoose.model('Channel', channel_schema);

module.exports = Channel;