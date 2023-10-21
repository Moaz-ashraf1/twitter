const { check } = require("express-validator");

const vaildatorMiddleware = require("../../middleware/validatorMiddleware");
const User = require("../../models/userModel")

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

        check("password").notEmpty().withMessage("User must have a password").isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),

        check("ConfirmPassword").notEmpty()
            .withMessage("User must enter password confirm")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("The password confirmation does not match ");
                }
                return true;
            }),

        vaildatorMiddleware
    ]

exports.loginVaildator =
    [


        check("email").notEmpty()
            .withMessage("User must have an email ")
            .isEmail()
            .withMessage("Invalid email address").custom(async (value) => {
                const user = await User.findOne({ email: value });
                if (!user) {
                    throw new Error("no user with this email address");
                }
                return true;
            }),

        check("password").notEmpty().withMessage("User must enter a password")
        ,

        vaildatorMiddleware
    ]