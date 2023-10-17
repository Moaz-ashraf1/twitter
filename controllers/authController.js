const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken")
const User = require("../models/userModel")
const {sanitizeData} = require("../utils/sanitizeData")

exports.signUp = asyncHandler(async(req,res,next)=>{
    const {name ,email ,password ,role} = req.body;
    const user  = await User.create({name,email,password,role})
    

    const token = await JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    
    res.status(201).json({data :sanitizeData(user) ,token})
});