//importar multer
const multer = require("multer");
// path per treballar amb rutes
const path = require("path");

// config de on es guardaran els fitxers
const storage = multer.diskStorage({
  // desti de la pujada
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },

  // nom del fitxer
  filename: (req, file, cb) => {
    // agafar extensio del fitxer
    const ext = path.extname(file.originalname);
    // nom base sense extensio
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .toLowerCase(); // substituir espais per guions

    // timetamp per evitar noms repetits
    const uniqueName = Date.now() + "-" + baseName + ext;
    // retornar nom final
    cb(null, uniqueName);
  },
});

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

  // si es imatge valida
  if (mimespermesos.includes(mime)) {
    cb(null, true);
  } else {
    // crear error
    const error = new Error("Tipus de fitxer no permes");
    error.statusCode = 400;
    cb(error, false);
  }
};

// configurar multer
const uploadLocal = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // mida max 5MB
});
// exportar configuracio
module.exports = uploadLocal;
