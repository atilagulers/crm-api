const express = require('express');
const router = express.Router();

const {
  getAllCustomerGroups,
  getCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
} = require('../controllers/customerGroup');

router.route('/').get(getAllCustomerGroups).post(createCustomerGroup);
router.route('/:id').get(getCustomerGroup).patch(updateCustomerGroup);

module.exports = router;
