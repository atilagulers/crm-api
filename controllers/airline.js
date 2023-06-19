const Airline = require('../models/Airline');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllAirlines = async (req, res) => {
  const airlines = await Airline.find();

  res.status(StatusCodes.OK).json({count: airlines.length, airlines});
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
