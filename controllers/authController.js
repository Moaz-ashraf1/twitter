const asyncHandler = require("express-async-handler");
const bcrypt= require('bcryptjs')
const JWT = require('jsonwebtoken')
const User = require("../models/userModel")
const {sanitizeData} = require("../utils/sanitizeData")
const AppError = require("../utils/appError")
const {createToken} = require("../utils/creatToken")

// @desc   signup
// @route  GET /api/v1/auth/signup
// @access public
exports.signUp = asyncHandler(async(req,res,next)=>{
    const {name ,email ,password ,role} = req.body;
    const user  = await User.create({name,email,password,role})
    

    const token = await JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    
    res.status(201).json({data :sanitizeData(user) ,token})
});

// @desc   login
// @route  GET /api/v1/auth/login
// @access public
exports.login = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body
    const user = await User.findOne({email: email});
    if(!(await bcrypt.compare(password, user.password)) || !user){
        return next(new AppError("Incorrecte email or password", 401)); 
    }
   const token = await createToken(user)
   res.status(201).json({data :sanitizeData(user) ,token})
})

// @desc  make sure that user is logged in
exports.protect = asyncHandler(async(req,res,next)=>{
    
 // 1) Check if token exist, if exist get it
let token;
if(req.headers.authorization&& req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(" ")[1];
}
if (!token) {
    return next(
      new AppError(
        "You are not logged in, please login to get access to this route.",
        401
      )
    );
  }

// 2) verify token
  const decode = await JWT.verify(token ,process.env.JWT_SECRET_KEY)


// 3) check if user is exist
const currentUser = await User.findById(decode.userId);

if (!currentUser) {
    return next(
      new AppError("the user that belong to this token does not exist", 403)
    );
  }
    // 4) check if user changed his password after token created
    if(currentUser.changePasswordAt){
        const changedPasswordAt = parseInt(currentUser.changePasswordAt.getTime()/1000,10);
        if (changedPasswordAt > decode.iat) {
            return next(
              new AppError("User changed password after token created"),
              401
            );
          }
    }

    // 5) check if user Inactive account ?
  if (!currentUser.active) {
    return next(new AppError("This account has been deactivated"), 401);
  }
  req.currentUser = currentUser;
  next();
});

 


