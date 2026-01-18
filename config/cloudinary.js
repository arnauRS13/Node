const cloudinary = require("cloudinary").v2;

// configuracio de cloudinary
cloudinary.config({
  // nom del compte
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api key publica
  api_key: process.env.CLOUDINARY_API_KEY,
  // clau secreta privada
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// exportar configuracio
module.exports = cloudinary;
