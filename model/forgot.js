const mongoose = require('mongoose');

// Mongoose schema for store the email verification information 
const schema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expire: {
        type: Number, 
        required: true
    }
})

module.exports = mongoose.model('password_tokens', schema);