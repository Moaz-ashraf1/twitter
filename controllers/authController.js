const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const crypto = require('crypto');

const User = require("../models/userModel")
const { sanitizeData } = require("../utils/sanitizeData")
const AppError = require("../utils/appError")
const { createToken } = require("../utils/creatToken")

// @desc   signup
// @route  GET /api/v1/auth/signup
// @access public
exports.signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role })


    const token = await JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });

    res.status(201).json({ data: sanitizeData(user), token })
});

// @desc   login
// @route  GET /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email });
    if (!(await bcrypt.compare(password, user.password)) || !user) {
        return next(new AppError("Incorrecte email or password", 401));
    }
    const token = await createToken(user)
    res.status(201).json({ data: sanitizeData(user), token })
})

// @desc  make sure that user is logged in
exports.protect = asyncHandler(async (req, res, next) => {

    // 1) Check if token exist, if exist get it
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(
            new AppError(
                "You are not logged in, please login to get access to this route.",
                401
            )
        );
    }

    // 2) verify token
    const decode = await JWT.verify(token, process.env.JWT_SECRET_KEY)


    // 3) check if user is exist
    const currentUser = await User.findById(decode.userId);

    if (!currentUser) {
        return next(
            new AppError("the user that belong to this token does not exist", 403)
        );
    }
    // 4) check if user changed his password after token created
    if (currentUser.changePasswordAt) {
        const changedPasswordAt = parseInt(currentUser.changePasswordAt.getTime() / 1000, 10);
        if (changedPasswordAt > decode.iat) {
            return next(
                new AppError("User changed password after token created"),
                401
            );
        }
    }

    // 5) check if user Inactive account ?
    if (!currentUser.active) {
        return next(new AppError("This account has been deactivated"), 401);
    }
    req.currentUser = currentUser;
    next();
});

//@desc Authorization (User Permissions)
exports.allowedTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
        return next(
            new AppError("You are not allowed to access this route", 401)
        );
    }

    next();
});

// @desc   forgotPassword
// @route  POST /api/v1/auth/forgotPassword
// @access public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new AppError(`There is no user with that email ${req.body.email}`, 404)
        );
    }

    // 2) If user is already existing, generate random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hasedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // 3) save hased reset code,expiration time and password reset verified in db

    user.passwordResetCode = hasedResetCode;
    user.passwordExpTime = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;





});

