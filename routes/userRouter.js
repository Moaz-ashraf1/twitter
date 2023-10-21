const express = require('express');

const router = express.Router();

const { protect, allowedTo } = require("../controllers/authController")
const { createUser, getAllUsers, getUser, updateUser, deleteUser } = require("../controllers/userController")

router.route('/').get(protect, allowedTo('admin'), getAllUsers).post(protect, allowedTo('admin'), createUser);

router.route('/:id').get(protect, allowedTo('admin'), getUser).put(protect, allowedTo('admin'), updateUser).delete(protect, allowedTo('admin'), deleteUser)



module.exports = router