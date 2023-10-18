const asyncHandler = require("express-async-handler");
const UserProfile = require("../models/userModel")
exports.createUser = asyncHandler(async (req, res, next) => {
    const { userId, phone, bio, profilePhoto, dateOfBirth } = req.body


    const userProfile = await UserProfile.create({
        userId,
        phone,
        bio,
        profilePhoto,
        dateOfBirth
    })

    res.status(200).json({ userProfile })
});

exports.getSpecificUser = asyncHandler(async (req, res, next) => {

    const user = await UserProfile.findById(req.params.userId);
    res.status(200).json({ user })
});