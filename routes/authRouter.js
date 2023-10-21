const express = require('express');

const router = express.Router();

const { signUp, login, forgotPassword, vertifyPasswordResetCode, resetPassword } = require("../controllers/authController")
const { signupVaildator, loginVaildator } = require("../utils/vaildators/authVaildator")

router.route('/signUp').post(signupVaildator, signUp);
router.route('/login').post(loginVaildator, login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/vertifyPasswordResetCode').post(vertifyPasswordResetCode);
router.route('/resetPassword').post(resetPassword);

module.exports = router