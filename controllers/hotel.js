const Hotel = require('../models/Hotel');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllHotels = async (req, res) => {
  const {page, limit} = req.params;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const hotelsQuery = Hotel.aggregate([{$skip: skip}, {$limit: limitNumber}]);

  const countQuery = Hotel.countDocuments();

  const [hotels, totalCount] = await Promise.all([hotelsQuery, countQuery]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    hotels,
  });
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
