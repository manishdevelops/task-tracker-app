const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/userRoutes');
const globalErrorController = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use(express.json());

//for users
app.use('/api/users', userRoute);


app.use(globalErrorController);

module.exports = app;