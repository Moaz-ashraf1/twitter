const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const User = require("../models/userModel");
const AppError = require("../utils/appError");


//Upload Image Using Multer

// 1- DiskStorage engine
// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/users')
//     },
//     filename: function (req, file, cb) {
//         const fileName = `user-${uuidv4()}-${Date.now()}.${file.mimetype.split('/')[1]}`
//         cb(null, fileName)
//     }
// })

// 2- MemoryStorage engine
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError("Only images allowed", 400), false)
    }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadUserImage = upload.single('profileImage')

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`

    const circleSize = 400;

    await sharp(req.file.buffer)
        .resize(circleSize, circleSize)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .composite([
            {
                input: Buffer.from(
                    `<svg><circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${circleSize / 2}" fill="white"/></svg>`
                ),
                blend: 'dest-in',
            },
        ])
        .toFile(`uploads/users/${fileName}`);

    // await sharp(req.file.buffer)
    //     .resize(400, 400)
    //     .toFormat('jpeg')
    //     .jpeg({ quality: 90 })
    //     .toFile(`uploads/users/${fileName}`);

    req.body.profileImage = fileName;

    next();
});

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

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate({ _id: req.params.id }, {
        password: await bcrypt.hash(req.body.newPassword, 12)
    }, { new: true })

    if (!user) {
        return next(
            new AppError(`No user for this id ${req.params.id}`, 400)
        );
    }
    res.status(200).json({ user });
})