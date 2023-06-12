const CustomError = require('./custom');
const UnauthenticatedError = require('./unauthenticated');
const NotFoundError = require('./notFound');
const BadRequestError = require('./badRequest');

module.exports = {
  CustomError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
};
