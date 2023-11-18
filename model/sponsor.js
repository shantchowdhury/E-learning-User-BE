const mongoose = require('mongoose');
const sponsorSchema = new mongoose.Schema({}, {strict: false});

module.exports = mongoose.model('sponsors', sponsorSchema);