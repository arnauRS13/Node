const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// registre
exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // retorno errors
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email, password } = req.body;

  // miro si ja existeix
  User.findOne({ email: String(email).toLowerCase() })
    .then((exists) => {
      if (exists) {
        return res.status(400).json({
          success: false,
          error: "Aquest email ja esta registrat",
        });
      }

      // creo user
      const user = new User({ name, email, password, role: "user" });

      return user.save();
    })
    .then((user) => {
      if (!user) return;

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: "Usuari registrat correctament",
        data: {
          token: token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      });
    })
    .catch(() => {
      return res.status(500).json({
        success: false,
        error: "Error del servidor",
      });
    });
};

// login
exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { email, password } = req.body;

  // busco user amb password
  User.findOne({ email: String(email).toLowerCase() })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Credencials incorrectes",
        });
      }

      // comparo passw
      return user.comparePassword(password).then((ok) => {
        if (!ok) {
          return res.status(401).json({
            success: false,
            error: "Credencials incorrectes",
          });
        }

        const token = generateToken(user);

        return res.status(200).json({
          success: true,
          message: "Sessio iniciada correctament",
          data: {
            token: token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          },
        });
      });
    })
    .catch(() => {
      return res.status(500).json({
        success: false,
        error: "Error del servidor",
      });
    });
};

// me
exports.getMe = (req, res) => {
  // req.user ja ve del middleware auth
  return res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

// update profile
exports.updateProfile = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { name, email } = req.body;

  // si canvia email miro duplicat
  const checkEmail = email
    ? User.findOne({
        email: String(email).toLowerCase(),
        _id: { $ne: req.user._id },
      })
    : Promise.resolve(null);

  checkEmail
    .then((exists) => {
      if (exists) {
        return res.status(400).json({
          success: false,
          error: "Aquest email ja està en us",
        });
      }

      return User.findById(req.user._id);
    })
    .then((user) => {
      if (!user) return;

      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = String(email).toLowerCase();

      // rol NO es toca
      return user.save();
    })
    .then((user) => {
      if (!user) return;

      return res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    })
    .catch(() => {
      return res.status(500).json({
        success: false,
        error: "Error del servidor",
      });
    });
};

// change password
exports.changePassword = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { currentPassword, newPassword } = req.body;

  // necessito user amb password
  User.findById(req.user._id)
    .select("+password")
    .then((user) => {
      if (!user) return;

      return user.comparePassword(currentPassword).then((ok) => {
        if (!ok) {
          return res.status(401).json({
            success: false,
            error: "Credencials incorrectes",
          });
        }

        user.password = newPassword;
        return user.save();
      });
    })
    .then((saved) => {
      if (!saved) return;

      return res.status(200).json({
        success: true,
        message: "Contrasenya actualitzada",
      });
    })
    .catch(() => {
      return res.status(500).json({
        success: false,
        error: "Error del servidor",
      });
    });
};
