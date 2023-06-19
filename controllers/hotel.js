const Hotel = require('../models/Hotel');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllHotels = async (req, res) => {
  const hotels = await Hotel.find();

  res.status(StatusCodes.OK).json({count: hotels.length, hotels});
};

const getHotel = async (req, res) => {
  const {id: hotelId} = req.params;

  const hotel = await Hotel.findById(hotelId);

  if (!hotel) throw new NotFoundError(`No hotel with id ${hotelId}`);

  res.status(StatusCodes.OK).json(hotel);
};

const createHotel = async (req, res) => {
  const hotel = await Hotel.create(req.body);

  res.status(StatusCodes.CREATED).json(hotel);
};

const updateHotel = async (req, res) => {
  const {id: hotelId} = req.params;

  const hotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!hotel) throw new NotFoundError(`No hotel with id ${hotelId}`);

  res.status(StatusCodes.OK).json(hotel);
};

module.exports = {getAllHotels, getHotel, createHotel, updateHotel};
