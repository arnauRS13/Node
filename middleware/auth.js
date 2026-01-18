const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = (req, res, next) => {
  const header = req.headers.authorization; // header auth

  // si no hi ha header
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "No autoritzat.",
    });
  }

  const token = header.split(" ")[1]; // agafo token

  // verifico token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: "Token invalid o expirat",
      });
    }

    // busco user per id
    User.findById(decoded.userId)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            success: false,
            error: "Usuari no trobat",
          });
        }

        req.user = user; // enganxo user a la request
        next(); // segueixo
      })
      .catch(() => {
        return res.status(500).json({
          success: false,
          error: "Error del servidor",
        });
      });
  });
};

module.exports = auth;
