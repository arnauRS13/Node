const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const adminController = require("../controllers/adminController");

// tot aqui requereix estar loguejat
router.use(auth);

// ser admin
router.use(roleCheck(["admin"]));

// llistar usuaris
router.get("/users", adminController.getAllUsers);

// canviar rol usuari
router.put("/users/:id/role", adminController.updateUserRole);

module.exports = router;
