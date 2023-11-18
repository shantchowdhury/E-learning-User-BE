const Payment = require('../model/payment');
const Course = require('../model/course');
const Student = require('../model/student');


const createPayment = async (req, res) => {
  try {
    const studentId=req.body.id;
    const { method, transactionID, status, courseId, totalPrice } = req.body;

    const studentExists = await Student.findById(studentId);
    const courseExists = await Course.findById(courseId);

    if (!studentExists || !courseExists) {
      return res.status(404).json({ error: 'Student or course not found' });
    }

    const newPayment = new Payment({
      method,
      transactionID,
      status,
      studentId,
      courseId,
      totalPrice,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating payment' });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment' });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { method, transactionID, status, studentId, courseId, totalPrice } = req.body;

    const studentExists = await Student.findById(studentId);
    const courseExists = await Course.findById(courseId);

    if (!studentExists || !courseExists) {
      return res.status(404).json({ error: 'Student or course not found' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        method,
        transactionID,
        status,
        studentId,
        courseId,
        totalPrice,
      },
      { new: true } 
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment' });
  }
};

const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(deletedPayment);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting payment' });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};

