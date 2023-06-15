const express = require('express');
const router = express.Router();

const {getAllUsers, getUser, createUser} = require('../controllers/user');

router.route('/').get(getAllUsers).post(createUser);

module.exports = router;
