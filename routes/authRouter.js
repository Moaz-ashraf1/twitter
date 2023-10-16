const express = require('express');

const router = express.Router();

const {signUp} = require("../controllers/authController")
const {signupVaildator} = require("../utils/vaildators/authVaildator")
 router.route('/signUp').post(signupVaildator,signUp);
 
 module.exports = router