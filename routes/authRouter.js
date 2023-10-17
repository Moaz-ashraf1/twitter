const express = require('express');

const router = express.Router();

const { signUp, login, protect, forgotPassword } = require("../controllers/authController")
const { signupVaildator } = require("../utils/vaildators/authVaildator")
router.route('/signUp').post(signupVaildator, signUp);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);

module.exports = router