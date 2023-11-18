const mongoose = require("mongoose");

// Mongoose schema for store the Student data
const applicationSchema = new mongoose.Schema({
  Name: {type: String, required: true},
  Institute: {type: String, required: true},
  Department: {type: String, required: true},
  Year_of_study: {type: Number, required: true},
  Phone: {type: String, required: true},
  Email: {type: String, require: true},
  Street: {type: String, required: true},
  City: {type: String, required: true},
  Zip: {type: String, required: true},
  answers: {type: Object, required: true},
  Facebook: {type: String, required: true},
  LinkedIn: {type: String, required: true},
  Twitter: {type: String, default: ''},
  image: {type: String, required: true},
  position: {type: String, default: 'Campus Ambassador'},
});


module.exports = mongoose.model('applications', applicationSchema);