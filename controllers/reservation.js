const Reservation = require('../models/Reservation');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllReservations = async (req, res) => {
  const {page, limit, sortBy, sortOrder, customerId} = req.query;

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
