// model basic de tasca

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  // titol obligatori
  title: {
    type: String,
    required: true,
  },
  // descripcio opcional
  description: {
    type: String,
  },
  // cost obligatori
  cost: {
    type: Number,
    required: true,
  },
  // hores previstes obligatories
  hours_estimated: {
    type: Number,
    required: true,
  },
  // hores reals opcionals
  hours_real: {
    type: Number,
  },
  // url o ruta imatge
  image: {
    type: String,
  },
  // estat completada
  completed: {
    type: Boolean,
    default: false,
  },
  // data finalitzacio quan esta completada
  finished_at: {
    type: Date,
  },
  // data creacio automatica
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // obligatori
    index: true,
  },
});

// abans de guardar una tasca si esta completada i no te data la posem
taskSchema.pre("save", function (next) {
  if (this.completed && !this.finished_at) {
    this.finished_at = new Date();
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
