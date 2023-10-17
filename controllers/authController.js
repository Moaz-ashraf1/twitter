const asyncHandler = require("express-async-handler");
const bcrypt= require('bcryptjs')

const User = require("../models/userModel")
const {sanitizeData} = require("../utils/sanitizeData")
const AppError = require("../utils/appError")
const {createToken} = require("../utils/creatToken")

exports.signUp = asyncHandler(async(req,res,next)=>{
    const {name ,email ,password ,role} = req.body;
    const user  = await User.create({name,email,password,role})
    

    const token = await JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    
    res.status(201).json({data :sanitizeData(user) ,token})
});
exports.login = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body
    const user = await User.findOne({email: email});
    if(!(await bcrypt.compare(password, user.password)) || !user){
        return next(new AppError("Incorrecte email or password", 401)); 
    }
   const token = await createToken(user)
   res.status(201).json({data :sanitizeData(user) ,token})
})