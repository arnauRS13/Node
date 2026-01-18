// models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String }, // nom opcional
    email: {
      type: String,
      required: true, // obligatori
      unique: true, // no repetits
      lowercase: true, // sempre en minus
      trim: true, // fora espais
    },
    password: {
      type: String,
      required: true, // obligatori
      minlength: 6, // minim 6
      select: false, // per defecte no la tornem
    },
    role: {
      type: String,
      enum: ["user", "admin"], // rols permesos
      default: "user", // per defecte user
    },
  },
  { timestamps: true } // createdAt i updatedAt
);

// abans de guardar mirar si cal xifrar passw
userSchema.pre("save", function (next) {
  // si no s ha tocat passw no fem res
  if (!this.isModified("password")) return next();

  // xifrem amb bcrypt
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(this.password, salt))
    .then((hash) => {
      this.password = hash; // guardo hash
      next();
    })
    .catch((err) => next(err));
});

// comparar password (login)
userSchema.methods.comparePassword = function (plainPassword) {
  // comparo la passw en text amb el hash
  return bcrypt.compare(plainPassword, this.password);
};

// quan retorno user en json trec passw
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // fora password
  return obj;
};

module.exports = mongoose.model("User", userSchema);
