const mongoose = require('mongoose');
const testimonialSchema = new mongoose.Schema({}, {strict: false});

module.exports = mongoose.model('testimonials', testimonialSchema);