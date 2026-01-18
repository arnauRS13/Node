const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  // payload del token
  const payload = {
    userId: user._id, // id
    email: user.email, // email
    role: user.role, // rol
  };

  // genero token
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // expiracio
  });
};

module.exports = generateToken;
