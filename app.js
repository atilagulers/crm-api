require('dotenv').config();
const express = require('express');

const app = express();
const helmet = require('helmet');

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//app.use(express.static('public'));

// connectDB
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');

// error handler
const notFoundMiddleware = require('./middleware/notFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

// routes
app.use('/api/v1/auth', authRouter);

app.get('/', (req, res) => {
  res.send('HOME');
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
