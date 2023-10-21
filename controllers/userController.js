const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// @desc   Create user
// @route  POST /api/v1/users
// @access private
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({ user })
});

// @desc   Get list of users
// @route  GET /api/v1/users
// @access private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        results: users.length,
        users
    });
})

// @desc   Get specific user by id
// @route  GET /api/v1/users/:id
// @access private
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError("User not found", 404))
    }
    res.status(200).json({ user });
})

// @desc   Update specific user by id
// @route  PATCH /api/v1/users/:id
// @access private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        role: req.body.role,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
    }, { new: true })

    if (!user) {
        return next(
            new AppError(`No user for this id ${req.params.id}`, 400)
        );
    }
    res.status(200).json({ user });
});

// @desc   Delete specific user by id
// @route  DELETE /api/v1/users/:id
// @access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false });

    if (!user) {
        return next(
            new AppError(`No document for this id ${req.params.Id}`, 400)
        );
    }
    res.status(200).json({
        message: "User deleted successfully"
    })
})