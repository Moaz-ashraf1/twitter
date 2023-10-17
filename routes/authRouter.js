const express = require('express');

const router = express.Router();

const { signUp, login, protect, forgotPassword, vertifyPasswordResetCode } = require("../controllers/authController")
const { signupVaildator } = require("../utils/vaildators/authVaildator")
router.route('/signUp').post(signupVaildator, signUp);
router.route('/login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/vertifyPasswordResetCode').post(vertifyPasswordResetCode);

module.exports = router