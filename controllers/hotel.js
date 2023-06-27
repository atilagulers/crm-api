const Hotel = require('../models/Hotel');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllHotels = async (req, res) => {
  const {page, limit, sortBy, sortOrder} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const sortField = sortBy || 'name';
  const sortDirection = parseInt(sortOrder) || 1;

  const sortQuery = {[sortField]: sortDirection};

  const collationOptions = {
    locale: 'tr',
    caseLevel: false,
    caseFirst: 'off',
    strength: 2,
  };

  const hotelsQuery = Hotel.aggregate([
    {$sort: sortQuery},
    {$skip: skip},
    {$limit: limitNumber},
  ]).collation(collationOptions);

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
