const Customer = require('../models/Customer');
const {StatusCodes} = require('http-status-codes');
const {NotFoundError} = require('../errors');

const getAllCustomers = async (req, res) => {
  const customers = await Customer.find();

  res.status(StatusCodes.OK).json({count: customers.length, customers});
};

const getCustomer = async (req, res) => {
  const {id: customerId} = req.params;

  const customer = await Customer.findById(customerId);

  if (!customer) throw new NotFoundError(`No customer with id ${customerId}`);

  res.status(StatusCodes.OK).json(customer);
};

const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);

  res.status(StatusCodes.CREATED).json(customer);
};

const updateCustomer = async (req, res) => {
  const {id: customerId} = req.params;
  const customer = await Customer.findByIdAndUpdate(
    {_id: customerId},
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customer) throw new NotFoundError(`No customer with id ${customerId}`);

  res.status(StatusCodes.OK).json(customer);
};

module.exports = {getAllCustomers, getCustomer, createCustomer, updateCustomer};
