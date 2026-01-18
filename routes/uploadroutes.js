const express = require("express");
const router = express.Router();

// importar middlewares
const uploadCloudMiddleware = require("../middleware/uploadCloud");
const uploadLocalMiddleware = require("../middleware/uploadLocal");

// importar controllers
const { uploadLocal, uploadCloud } = require("../controllers/uploadController");

// ruta per pujar fitxers a local
router.post("/local", uploadLocalMiddleware.single("image"), uploadLocal);
// ruta per pujar fitxers a cloudinary
router.post("/cloud", uploadCloudMiddleware.single("image"), uploadCloud);

module.exports = router;
