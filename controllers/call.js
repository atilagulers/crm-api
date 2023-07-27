const Call = require('../models/Call');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');
const mongoose = require('mongoose');

const getAllCalls = async (req, res) => {
  const {page, limit, sortBy, sortOrder, customerId, userId} = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const sort = {};
  if (sortBy && sortOrder) {
    sort[sortBy] = parseInt(sortOrder);
  }

  const filter = {};

  if (customerId) {
    filter.customer = new mongoose.Types.ObjectId(customerId);
  }

  const callsQuery = Call.aggregate([
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

  const countQuery = Call.countDocuments();

  const [calls, totalCount] = await Promise.all([callsQuery, countQuery]);

  res.status(StatusCodes.OK).json({
    totalCount,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCount / limitNumber),
    calls,
  });
};

const getCall = async (req, res) => {
  const {id: callId} = req.params;

  const call = await Call.findById(callId)
    .populate('user', '-password')
    .populate('customer');

  if (!call) throw new NotFoundError(`No call with id ${customerId}`);

  res.status(StatusCodes.OK).json(call);
};

const createCall = async (req, res) => {
  const call = await Call.create(req.body);

  res.status(StatusCodes.CREATED).json(call);
};

const updateCall = async (req, res) => {
  const {id: callId} = req.params;
  const call = await Call.findByIdAndUpdate(callId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!call) throw new NotFoundError(`No call with id ${callId}`);

  res.status(StatusCodes.OK).json(customer);
};

module.exports = {getAllCalls, getCall, createCall, updateCall};
