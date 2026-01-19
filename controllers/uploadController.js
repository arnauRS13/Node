
const cloudinary = require("../config/cloudinary");

// pujada local /uploads
const uploadLocalController = (req, res) => {
  // si no hi ha fitxer

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  if (!req.file) {
    // error 400
    return res.status(400).json({
      success: false,
      message: "No sha pujat cap fitxer",
    });
  }

  // info del fitxer que multer ha guardat
  const file = req.file;

  // comprovar mida maxima
  if (file.size > MAX_SIZE) {
    return res.status(400).json({
      success: false,
      message: "El fitxer es massa gran",
      size: file.size,
    });
  }

  // ruta relativa per accedir al fitxer
  const filePath = `/uploads/${file.filename}`;

  // url completa per accedir des del navegador
  const fileUrl = `${req.protocol}://${req.get("host")}${filePath}`;

  // resposta exitosa
  return res.status(200).json({
    success: true,
    message: "Fitxer pujat correctament",
    image: {
      filename: file.filename,
      path: filePath, // ruta relativa be
      url: fileUrl, // url completa
      size: file.size,
      mimetype: file.mimetype,
    },
  });
};

// pujada a cloudinary
const uploadCloudController = (req, res) => {
  // si no hi ha fitxer
  if (!req.file) {
    // error 400
    return res.status(400).json({
      success: false,
      message: "No sha pujat cap fitxer",
    });
  }

  // info del fitxer que multer ha guardat a memorystorage
  const file = req.file;

  // crear data uri a partir del buffer
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString(
    "base64"
  )}`;

  // carpeta on guardem les imatges a cloudinary
  const folder = "projecte/uploads";

  // pujar a cloudinary
  cloudinary.uploader
    .upload(dataUri, { folder: folder })
    .then((result) => {
      // resposta exitosa
      return res.status(200).json({
        success: true,
        message: "Fitxer pujat correctament",
        image: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: file.size,
        },
      });
    })
    .catch((error) => {
      // si falla algo a cloudinary, ho loguem al server
      console.error("Error pujant a cloudinary:", error);

      // resposta derror generica
      return res.status(500).json({
        success: false,
        message: "Error pujant imatge a cloudinary",
      });
    });
};

// exporto els dos controladors
module.exports = {
  uploadLocal: uploadLocalController,
  uploadCloud: uploadCloudController,
};
