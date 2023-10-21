const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)
    res.status(201).json({ user })
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ users });
})

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
})

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

    res.status(200).json({ user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.id, { active: false });

    res.status(200).json({
        message: "User deleted successfully"
    })
})