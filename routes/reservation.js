const express = require('express');
const router = express.Router();

const {
  getAllReservations,
  getReservation,
  createReservation,
  updateReservation,
} = require('../controllers/reservation');

router.route('/').get(getAllReservations).post(createReservation);
router.route('/:id').get(getReservation).patch(updateReservation);

module.exports = router;
