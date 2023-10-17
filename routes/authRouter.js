const express = require('express');

const router = express.Router();

const {signUp,login} = require("../controllers/authController")
const {signupVaildator} = require("../utils/vaildators/authVaildator")
 router.route('/signUp').post(signupVaildator,signUp);
 router.route('/login').post(login);
 
 module.exports = router