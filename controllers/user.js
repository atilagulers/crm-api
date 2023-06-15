const {UnauthenticatedError} = require('../errors');

const getAllUsers = async (req, res) => {
  res.json(req.user);
};

const getUser = async (req, res) => {
  res.json('get user');
};
const createUser = async (req, res, next) => {
  const {role} = req.user;

  if (role !== 'admin')
    throw new UnauthenticatedError('Authentication invalid');

  const user = await User.create(req.body);
  //const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      role: user.role,
    },
    token,
  });
};

module.exports = {getAllUsers, getUser, createUser};
