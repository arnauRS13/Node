const { body } = require("express-validator");

exports.registerValidation = [
  body("email").isEmail().withMessage("Email no valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minim 6 caracters"),
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name minim 2 caracters"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Email no valid"),
  body("password").notEmpty().withMessage("Password obligatoria"),
];

exports.changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("currentPassword obligatoria"),
  body("newPassword").isLength({ min: 6 }).withMessage("newPassword minim 6"),
];

exports.updateProfileValidation = [
  body("email").optional().isEmail().withMessage("Email no valid"),
  body("name").optional().isLength({ min: 2 }).withMessage("Name minim 2"),
];
