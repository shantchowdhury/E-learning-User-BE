const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const studentSchema = new mongoose.Schema({
  Name: {type: String, required: true},
  Email: {type: String, unique: true, required: true},
  Phone: {type: String},
  Address: {type: String},
  Password: {type: String, require: true},
  profile_image: {type: Object, default: {normal: 'default.png', google_pic: null}},
  CV: {type: String},
  verified: {type: Boolean, default: false},
  is_active: {type: Boolean, default: true},
  joined: {type: String, require: true},
  login_type: {type: String, default: 'normal'},
  payments:  [{
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
}],
courses:  [{
  type: Schema.Types.ObjectId,
  ref: 'Course',
  required: true,
}],
allowedIPs: [{ type: String }],
});


module.exports = mongoose.model('students', studentSchema);