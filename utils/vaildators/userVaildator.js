const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const vaildatorMiddleware = require("../../middleware/validatorMiddleware");

const User = require("../../models/userModel")

exports.createUserValidator = [
    check("name")
        .notEmpty()
        .withMessage("User must have a name")
        .isLength({ min: 3 })
        .withMessage("To short User name")
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check("email")
        .notEmpty()
        .withMessage("User must have an email ")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("E-mail already in use  ");
            }
            return true;
        }),
    check("password")
        .notEmpty()
        .withMessage("User must have password ")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    check("passwordConfirm")
        .notEmpty()
        .withMessage("User must enter password confirm")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("The password confirmation does not match ");
            }
            return true;
        }),

    check("phone").optional().isMobilePhone(['ar-EG', 'ar-SA']).withMessage("Invaild phone number only accepted EG and SA"),

    check("profileImage").optional(),
    check("role").optional()


    , vaildatorMiddleware]

exports.getUserVaildator = [

    check("id").isMongoId().withMessage("invaid user id format"),

    vaildatorMiddleware,
];

exports.updateUserValidator = [
    check("id").isMongoId().withMessage("invaid user id format"),

    check("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("To short User name")
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    check("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("E-mail already in use");
            }
        }),

    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number; only accepted EG and SA"),

    check("profileImage").optional(),
    check("role").optional(),

    vaildatorMiddleware,
];

exports.deleteUserVaildator = [

    check("id").isMongoId().withMessage("invaid barnd id format"),

    vaildatorMiddleware,
];
