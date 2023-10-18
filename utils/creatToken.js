const JWT = require("jsonwebtoken")

exports.createToken = async (user, res) => {
    const token = await JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }

    res.cookie('JWT', token, cookieOptions)
    return token;
}
