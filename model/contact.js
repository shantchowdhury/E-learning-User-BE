const mongoose = require('mongoose');

// Mongoose schema for store the student's contact message
const schema = new mongoose.Schema({
    Name: { type: String, required: true},
    Email: {type: String, required: true},
    Subject: {type: String, required: true},
    Message: {type: String, required: true},
    history: {type: String}, 
    status: {type: Number, default: 0}, //status 0 mean pending and 1 mean solved 
    date: {type: String, required: true}
})

module.exports = mongoose.model('contact_entries', schema);
