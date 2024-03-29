require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');

const app = express();
const helmet = require('helmet');

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//app.use(express.static('public'));

// connectDB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const customerRouter = require('./routes/customer');
const hotelRouter = require('./routes/hotel');
const gameRouter = require('./routes/game');
const airlineRouter = require('./routes/airline');
const customerGroupRouter = require('./routes/customerGroup');
const callRouter = require('./routes/call');
const reservationRouter = require('./routes/reservation');

// auth
const authenticateUser = require('./middleware/authentication');

// error handler
const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', authenticateUser, userRouter);
app.use('/api/v1/customer', authenticateUser, customerRouter);
app.use('/api/v1/hotel', authenticateUser, hotelRouter);
app.use('/api/v1/game', authenticateUser, gameRouter);
app.use('/api/v1/airline', authenticateUser, airlineRouter);
app.use('/api/v1/customer-group', authenticateUser, customerGroupRouter);
app.use('/api/v1/call', authenticateUser, callRouter);
app.use('/api/v1/reservation', authenticateUser, reservationRouter);

app.get('/', (req, res) => {
  res.send('CRM API');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
