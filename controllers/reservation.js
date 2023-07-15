const Reservation = require('../models/Reservation');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllReservations = async (req, res) => {
  const {page, limit, sortBy, sortOrder, customerId, time} = req.query;

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

  if (time) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (time === 'future') {
      filter.arrivalDate = {$gt: todayEnd};
    } else if (time === 'today') {
      filter.arrivalDate = {$gte: todayStart, $lte: todayEnd};
    } else if (time === 'past') {
      filter.arrivalDate = {$lt: todayStart};
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
        localField: 'arrivalAirline',
        foreignField: '_id',
        as: 'arrivalAirline',
      },
    },
    {
      $lookup: {
        from: 'airlines',
        localField: 'returnAirline',
        foreignField: '_id',
        as: 'returnAirline',
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
    .populate('customer');

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

  res.status(StatusCodes.OK).json(customer);
};

module.exports = {
  getAllReservations,
  getReservation,
  createReservation,
  updateReservation,
};
