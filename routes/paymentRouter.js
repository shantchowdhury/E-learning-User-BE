const express = require('express');
const router = express.Router();
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');
const auth=require('../middleware/authorization');

router.post('/',auth, createPayment);
router.get('/', getAllPayments);
router.get('/get/:id',auth, getPaymentById);
router.put('/update/:id', updatePayment);
router.delete('/delete/:id', deletePayment);

module.exports = router;