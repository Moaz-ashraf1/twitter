const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const crypto = require('crypto');

const User = require("../models/authModel")
const { sanitizeData } = require("../utils/sanitizeData")
const AppError = require("../utils/appError")
const { createToken } = require("../utils/creatToken")
const { sendMail } = require("../utils/sendEmail")

// @desc   signup
// @route  GET /api/v1/auth/signup
// @access public
exports.signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role })


    const token = await createToken(user, res)

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
    const token = await createToken(user, res)
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
    await user.save();

    // 4) send reset code via email
    const message = `Hi ${user.name},\n we received a request to reset the password on your Twitter Account.\n ${resetCode}\n Enter this code to complete the reset.\n Thanks for helping us keep your account secure.\n`;

    try {
        await sendMail({
            to: user.email,
            subject: "Your password reset code (vaild for 10 min)",
            message,
        })
    } catch (error) {
        console.log(error);
        user.passwordResetCode = undefined;
        user.passwordExpTime = undefined;
        user.passwordResetVerified = undefined;
        await user.save();

        return next(new AppError("There is an error in sending email", 500));
    }

    res
        .status(200)
        .json({ status: "success", message: "Reset code sent to email" });


});

// @desc   vertify password reset code
// @route  POST /api/v1/auth/verifyReset
// @access public
exports.vertifyPasswordResetCode = asyncHandler(async (req, res, next) => {
    // 1)check if user exists
    const hasedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex")
    const user = await User.findOne({ passwordResetCode: hasedResetCode, passwordExpTime: { $gt: Date.now() } })
    if (!user) {
        return next(new AppError("Reset code invalid or expired"));
    }

    // 2) Reset code vaild
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: "success",
    });

})

// @desc   reset password
// @route  POST /api/v1/auth/resetPassword
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError("user not found"));
    }

    if (!user.passwordResetVerified) {
        return next(new AppError("Reset code not verified"));
    }

    user.passwordResetVerified = undefined;
    user.passwordExpTime = undefined;
    user.passwordResetCode = undefined;

    user.password = req.body.newPassword;
    user.save();

    const token = await createToken(user._id);

    res.status(200).json({ token });

});
