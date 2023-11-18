const mongoose = require('mongoose');

//This schema is for admin dashboard user not nonacademy registered user(students)
const userSchema = new mongoose.Schema({}, {strict: false});
  
  
module.exports = mongoose.model('admin_users', userSchema);