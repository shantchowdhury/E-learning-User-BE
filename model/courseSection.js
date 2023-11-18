const mongoose = require("mongoose");
const { Schema } = require('mongoose');

const courseSectionSchema = new mongoose.Schema({
  name: {type: String,unique: true, required: true},
  courseId:  {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
},
  description: {type: String},
  image:{type:String,required:true},
  IsSeen:{type:Boolean, default:false},
  rating:{type: String, default:'0'},
});


module.exports = mongoose.model('courseSection', courseSectionSchema);