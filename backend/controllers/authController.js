const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) Getting token and check of it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('Your are not logged in! Please login to get access.!'));
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //id,creation & expiry date

    // 3) Check if user still exists (after login if user deleted)
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    // for fututre purpose
    // req.user = currentUser;
    req.user = decoded;

    // GRANT ACCESS TO PROTECTED ROUTE
    next()
});



exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email, frontendUrl } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new AppError('User no longer exist.', 404));

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false }); // we manipulated the doc so we need to save;
    // validateBeforeSave: false -> this will deactivate all the validators that we specified in our schema

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL,
        to: `${user.email}`,
        subject: 'TaskTracker:Reset Your Password',
        text: `${frontendUrl}/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // console.log(error);
            return next(new AppError('There was an error sending the email. Try again later!', 500));
        } else {
            // console.log('Email sent: ' + info.response);
            return res.status(200).json({
                status: 'success',
                message: 'Token sent to email!'
            });
        }
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex'); //encrypt again bcz plain token has been sent and encrypted one is stored in the db

    const user = await User.findOne(
        {
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } // behind the scenes mongoDB doing everything
        });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    // console.log(user)

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // now we want to validate so , not used 'validateBeforeSave: false'

    createSendToken(user, 200, res);

});
