const express = require('express');
const router = express.Router();

const { protect, allowedTo } = require("../controllers/authController")
const { createUser, getAllUsers, getUser, updateUser, deleteUser, changeUserPassword, uploadUserImage, resizeImage, getAllFollowings, getAllFollowers } = require("../controllers/userController")
const { createUserValidator, getUserVaildator, updateUserValidator, deleteUserVaildator, changeUserPasswordVaildator } = require("../utils/vaildators/userVaildator")



router.route('/getAllFollowings').get(protect, getAllFollowings);
router.route('/getAllFollowers').get(protect, getAllFollowers);

router.route('/').get(protect, allowedTo('admin'), getAllUsers).

    post(protect, allowedTo('admin'), uploadUserImage, resizeImage, createUserValidator, createUser);

router.route('/:id').get(protect, allowedTo('admin'), getUserVaildator, getUser).put(protect, allowedTo('admin'), updateUserValidator, updateUser).delete(protect, allowedTo('admin'), deleteUserVaildator, deleteUser)

router.route("/changePassword/:id").post(protect, allowedTo('admin'), changeUserPasswordVaildator, changeUserPassword)

module.exports = router