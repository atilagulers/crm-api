const express = require('express');
const router = express.Router();

const {
  getAllHotels,
  createHotel,
  getHotel,
  updateHotel,
} = require('../controllers/hotel');

router.route('/').get(getAllHotels).post(createHotel);
router.route('/:id').get(getHotel).patch(updateHotel);

module.exports = router;
