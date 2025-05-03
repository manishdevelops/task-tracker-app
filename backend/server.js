const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// handle unhandled errors in synchronous code 
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1); //immediately aborts all requests
});

const app = require('./app');

const DB = process.env.MONGODB_URI;
mongoose.connect(DB).then(con => {
    console.log('DB connection successfull...');
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}...`);
});


// handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => { // giving some time for finishing requests that are still pending or being handled at the time
        process.exit(1); // only after that server is killed
    });
});