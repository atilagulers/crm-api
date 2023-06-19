const express = require('express');
const router = express.Router();

const {
  getAllAirlines,
  getAirline,
  createAirline,
  updateAirline,
} = require('../controllers/airline');

router.route('/').get(getAllAirlines).post(createAirline);
router.route('/:id').get(getAirline).patch(updateAirline);

module.exports = router;
