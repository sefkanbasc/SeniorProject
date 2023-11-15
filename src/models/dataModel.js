const mongoose = require('mongoose');

const Admin = mongoose.model('testData', mongoose.Schema({}, { strict: false }), 'testData');

module.exports = Admin;
