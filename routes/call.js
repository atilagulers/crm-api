const express = require('express');
const router = express.Router();

const {
  getAllCalls,
  getCall,
  createCall,
  updateCall,
} = require('../controllers/call');

router.route('/').get(getAllCalls).post(createCall);
router.route('/:id').get(getCall).patch(updateCall);

module.exports = router;
