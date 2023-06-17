const Hotel = require('../models/Hotel');
const {StatusCodes} = require('http-status-codes');

const getAllHotels = async (req, res) => {
  const hotels = await Hotel.find();

  res.status(StatusCodes.OK).json({count: hotels.length, hotels});
};

module.exports = {getAllHotels};
