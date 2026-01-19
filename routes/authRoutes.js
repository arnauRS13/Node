
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authController = require("../controllers/authController");

const v = require("../middleware/validators/authValidators");

// register
router.post("/register", v.registerValidation, authController.register);

// login
router.post("/login", v.loginValidation, authController.login);

// me
router.get("/me", auth, authController.getMe);

// update profile
router.put(
  "/profile",
  auth,
  v.updateProfileValidation,
  authController.updateProfile
);

// change password
router.put(
  "/change-password",
  auth,
  v.changePasswordValidation,
  authController.changePassword
);

module.exports = router;
