const express = require('express');

const router = express.Router();
const { protect, allowedTo } = require("../controllers/authController")
const { createUser, getSpecificUser } = require("../controllers/userController")

router.route('/').post(protect, createUser);
router.route('/:userId').get(getSpecificUser);
module.exports = router