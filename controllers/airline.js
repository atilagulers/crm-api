const Airline = require('../models/Airline');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllAirlines = async (req, res) => {
  const {page, limit} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const airlinesQuery = Airline.aggregate([
    {$skip: skip},
    {$limit: limitNumber},
  ]);

  const countQuery = Airline.countDocuments();

  const [airlines, totalCount] = await Promise.all([airlinesQuery, countQuery]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    airlines,
  });
};

const getAirline = async (req, res) => {
  const {id: airlineId} = req.params;

  const airline = await Airline.findById(airlineId);

  if (!airline) throw new NotFoundError(`No airline with id ${airlineId}`);

  res.status(StatusCodes.OK).json(airline);
};

const createAirline = async (req, res) => {
  const airline = await Airline.create(req.body);

  res.status(StatusCodes.CREATED).json(airline);
};

const updateAirline = async (req, res) => {
  const {id: airlineId} = req.params;

  const airline = await Airline.findByIdAndUpdate(airlineId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!airline) throw new NotFoundError(`No airline with id ${airlineId}`);

  res.status(StatusCodes.OK).json(airline);
};

module.exports = {getAllAirlines, getAirline, createAirline, updateAirline};
