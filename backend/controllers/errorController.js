const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack // shows where the error has happened
        });
    } else {
        return res.status(404).json({
            status: "error",
            message: "Something went very wrong!"
        });
    }
}

const handleCastErrorDB = (error) => {
    const message = `Invalid ${error.path}: ${error.value}`
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = error => {
    const [errorField, errorValue] = Object.entries(error.keyValue).flat();
    // const message = `Duplicate '${errorField}' value entered as '${errorValue}'.`;
    const message = 'Duplicate data entered.';
    return new AppError(message, 400);
}

const handleValidationErrorDB = error => {
    const errors = Object.values(error.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = error => new AppError('Invalid Token, Please log in again.!', 401);

const handleJWTExpiredError = error => new AppError('Your token has expired! Please log in again.!', 401);

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        //Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        //Programming or other unknown error: don't leak error details
        else {
            // 1) Log error
            console.error('ERROR ⚡⚡', err);

            //2) Send generic message
            return res.status(err.statusCode).json({
                status: 'error',
                message: 'Something went very wrong'
            });
        }
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        console.log(err)
        let error = { ...err, name: err.name };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error); // invalid id
        if (error.code === 11000) error = handleDuplicateFieldsDB(error); // duplicate fields
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error); //validatinng fileds
        if (error.name === 'JsonWebTokenError') error = handleJWTError(error); // handle token change
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error); // token time expires

        return sendErrorProd(error, req, res);
    }
}