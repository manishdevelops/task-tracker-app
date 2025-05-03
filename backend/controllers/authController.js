const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: user
        }
    });
};

exports.signup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country
    });

    createSendToken(newUser, 201, res);
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) return next(new AppError('Please provide email and password', 400));

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    // console.log(user)

    const validUser = await user?.correctPassword(password, user.password);

    if (!user || !validUser) {
        return next(new AppError('Incorrect Email or Password', 401));
    }

    // 3) If everything is ok send token to client
    createSendToken(user, 200, res);
});


exports.logout = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success'
    });
}
