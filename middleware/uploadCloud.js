const multer = require("multer");
const storage = multer.memoryStorage();

// filtrar tipus de fitxers
const fileFilter = (req, file, cb) => {
  // mimetype de la imatge
  const mime = file.mimetype;
  // llista de mimetypes permesos
  const mimespermesos = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/webp",
  ];

  // si es el tipus es valid
  if (mimespermesos.includes(mime)) {
    cb(null, true);
  } else {
    // crear error
    const error = new Error("Tipus de fitxer no permes");
    error.statusCode = 400;
    cb(error, false);
  }
};

// instancia de multer per cloudinary
const uploadCloud = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { filesize: 5 * 1024 * 1024 }, // mida max 5MB
});
module.exports = uploadCloud;
