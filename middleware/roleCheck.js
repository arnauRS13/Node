const roleCheck = (rolesAllowed) => {
  return (req, res, next) => {
    // si no hi ha user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "No autoritzat",
      });
    }

    // si no te rol correcte
    if (!rolesAllowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "No tens permisos",
      });
    }

    next(); // ok
  };
};

module.exports = roleCheck;
