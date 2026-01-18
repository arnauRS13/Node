const User = require("../models/User");

// llistar tots els usuaris
exports.getAllUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({
        success: true,
        data: users,
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        error: "Error del servidor",
      });
    });
};

// canviar rol d'un usuari
exports.updateUserRole = (req, res) => {
  const id = req.params.id; // id usuari
  const role = req.body.role; // nou rol

  // si no envien role
  if (!role) {
    return res.status(400).json({
      success: false,
      error: "cal enviar el camp role",
    });
  }

  // nomes acceptem user o admin
  if (role !== "user" && role !== "admin") {
    return res.status(400).json({
      success: false,
      error: "rol invalid",
    });
  }

  // actualitzo rol
  User.findByIdAndUpdate(id, { role: role }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "usuari no trobat",
        });
      }

      res.status(200).json({
        success: true,
        message: "rol actualitzat",
        data: user,
      });
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        error: "Error del servidor",
      });
    });
};
