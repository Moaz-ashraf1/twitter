const { check } = require("express-validator");

const vaildatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/authModel")

exports.signupVaildator =
    [
        check("name").notEmpty().withMessage("User must have a name").isLength({ min: 3 }).withMessage("To short User name"),
        check("email").notEmpty()
            .withMessage("User must have an email ")
            .isEmail()
            .withMessage("Invalid email address").custom(async (value) => {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw new Error("user already exists");
                }
                return true;
            }),
        vaildatorMiddleware
    ]