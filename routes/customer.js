const express = require('express');
const router = express.Router();

const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
} = require('../controllers/customer');

router.route('/').get(getAllCustomers).post(createCustomer);
router.route('/:id').get(getCustomer).patch(updateCustomer);

module.exports = router;
