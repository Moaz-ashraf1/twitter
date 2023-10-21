const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require("../controllers/authController")
const { createUser, getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController")
const { createUserValidator, getUserVaildator, updateUserValidator, deleteUserVaildator } = require("../utils/vaildators/userVaildator")


router.route('/').get(protect, allowedTo('admin'), getAllUsers).post(protect, allowedTo('admin'), createUserValidator, createUser);

router.route('/:id').get(protect, allowedTo('admin'), getUserVaildator, getUser).put(protect, allowedTo('admin'), updateUserValidator, updateUser).delete(protect, allowedTo('admin'), deleteUserVaildator, deleteUser)



module.exports = router