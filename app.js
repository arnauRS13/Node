//carregar variables del .env
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoute");
const uploadRoutes = require("./routes/uploadroutes");
const path = require("path");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

// per llegir json
app.use(express.json());

// imatges locals
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ruta de tasks
app.use("/api/tasks", taskRoutes);

// rutes de pujada d imatges
app.use("/api/upload", uploadRoutes);

// rutes d'administracio
app.use("/api/admin", adminRoutes);

// rutes d'autenticacio
app.use("/api/auth", authRoutes);

// conexio a mongodb local
mongoose
  .connect("mongodb://127.0.0.1:27017/tasksdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connectat a mongodb"))
  .catch((err) => console.log("error mongodb", err.message));

module.exports = app;
