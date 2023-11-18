const mongoose =require("mongoose");
const {Schema,model} =require("mongoose");
const Student=require('../model/student');

const paymentSchema = new mongoose.Schema({
  method: { type: String, required: true },
  transactionID: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  studentId:{ type: Schema.Types.ObjectId, ref: 'students', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  totalPrice: { type: Number, required: true },
});

paymentSchema.pre('save', async function (next) {
    try {
      const student = await Student.findById(this.studentId);
  
      if (!student) {
        throw new Error('Student not found');
      }

      student.payments.push(this._id);

    
      student.courses.push(this.courseId);

      await student.save();
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

  module.exports = mongoose.model('Payment', paymentSchema);