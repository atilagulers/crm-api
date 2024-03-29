const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllReservations = async (req, res) => {
  const {page, limit, sortBy, sortOrder, customerId, time, userId} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const sort = {};
  if (sortBy && sortOrder) {
    sort[sortBy] = parseInt(sortOrder);
  }

  const filter = {};
  if (customerId) {
    filter.customer = {_id: customerId};
  }

  if (userId && req.user.role !== 'admin') {
    filter.user = new mongoose.Types.ObjectId(userId);
  }

  if (time) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (time === 'future') {
      filter.departureDate = {$gt: todayEnd};
    } else if (time === 'today') {
      filter.departureDate = {$gte: todayStart, $lte: todayEnd};
    } else if (time === 'past') {
      filter.departureDate = {$lt: todayStart};
    }
  }

  const reservationsQuery = Reservation.aggregate([
    {$match: filter},
    {$sort: sort},
    {$skip: skip},
    {$limit: limitNumber},
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer',
      },
    },
    {
      $lookup: {
        from: 'airlines',
        localField: 'departureAirline',
        foreignField: '_id',
        as: 'departureAirline',
      },
    },
    {
      $lookup: {
        from: 'airlines',
        localField: 'arrivalAirline',
        foreignField: '_id',
        as: 'arrivalAirline',
      },
    },
    {
      $lookup: {
        from: 'hotels',
        localField: 'hotel',
        foreignField: '_id',
        as: 'hotel',
      },
    },

    {
      $project: {
        'user.password': 0,
      },
    },
  ]);

  const countQuery = Reservation.countDocuments();

  const [reservations, totalCount] = await Promise.all([
    reservationsQuery,
    countQuery,
  ]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    reservations,
  });
};

const getReservation = async (req, res) => {
  const {id: reservationId} = req.params;

  const reservation = await Reservation.findById(reservationId)
    .populate('user', '-password')
    .populate('customer')
    .populate('hotel')
    .populate('departureAirline')
    .populate('arrivalAirline');

  if (!reservation)
    throw new NotFoundError(`No reservation with id ${customerId}`);

  res.status(StatusCodes.OK).json(reservation);
};

const createReservation = async (req, res) => {
  const reservation = await Reservation.create(req.body);

  res.status(StatusCodes.CREATED).json(reservation);
};

const updateReservation = async (req, res) => {
  const {id: reservationId} = req.params;
  const reservation = await Reservation.findByIdAndUpdate(
    reservationId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!reservation)
    throw new NotFoundError(`No reservation with id ${reservationId}`);

  res.status(StatusCodes.OK).json(reservation);
};

module.exports = {
  getAllReservations,
  getReservation,
  createReservation,
  updateReservation,
};
