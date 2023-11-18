const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({}, {strict: false});

module.exports = mongoose.model('team_members', teamSchema);