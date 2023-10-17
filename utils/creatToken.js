const JWT = require("jsonwebtoken")

exports.createToken = async (user)=>{
    const token =  await JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    
    return token;
}
