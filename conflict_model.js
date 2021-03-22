var mongoose = require('mongoose');
const conflict_schema = require('./conflict_schema');

var Conflict = mongoose.model('Conflict', conflict_schema);

module.exports = Conflict;