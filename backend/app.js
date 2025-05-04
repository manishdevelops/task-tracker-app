const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const userRoute = require('./routes/userRoutes');
const projectRoute = require('./routes/projectRoutes');
const taskRoute = require('./routes/taskRoutes');


const globalErrorController = require('./controllers/errorController');

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

//for users
app.use('/api/users', userRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);


app.use(globalErrorController);

module.exports = app;