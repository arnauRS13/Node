const Task = require("../models/Task");

// crear nova tasca
exports.createTask = (req, res) => {
  const data = req.body;
  data.user = req.user._id; // assignem l'usuari autenticat

  const task = new Task(data);

  task
    .save()
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch(() => {
      res.status(400).json({ message: "error creant tasca" });
    });
};

// obtenir totes les tasques de l'usuari
exports.getTasks = (req, res) => {
  Task.find({ user: req.user._id })
    .then((tasks) => {
      res.json(tasks);
    })
    .catch(() => {
      res.status(500).json({ message: "error obtenint tasques" });
    });
};

// obtenir una tasca per id
exports.getTask = (req, res) => {
  const id = req.params.id;

  Task.findOne({ _id: id, user: req.user._id })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: "tasca no trobada" });
      }
      res.json(task);
    })
    .catch(() => {
      res.status(400).json({ message: "id invalid" });
    });
};

// actualitzar una tasca
exports.updateTask = (req, res) => {
  const id = req.params.id;
  const data = req.body;

  Task.findOne({ _id: id, user: req.user._id })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: "tasca no trobada" });
      }

      if (data.title !== undefined) task.title = data.title;
      if (data.description !== undefined) task.description = data.description;
      if (data.cost !== undefined) task.cost = data.cost;
      if (data.hours_estimated !== undefined)
        task.hours_estimated = data.hours_estimated;
      if (data.hours_real !== undefined) task.hours_real = data.hours_real;
      if (data.image !== undefined) task.image = data.image;

      if (data.completed !== undefined) {
        task.completed = data.completed;
        if (task.completed && !task.finished_at) {
          task.finished_at = new Date();
        }
      }

      return task.save();
    })
    .then((updated) => {
      if (updated) res.json(updated);
    })
    .catch(() => {
      res.status(400).json({ message: "error actualitzant tasca" });
    });
};

// eliminar una tasca
exports.deleteTask = (req, res) => {
  const id = req.params.id;

  Task.findOneAndDelete({ _id: id, user: req.user._id })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: "tasca no trobada" });
      }
      res.json({ message: "tasca eliminada" });
    })
    .catch(() => {
      res.status(400).json({ message: "error eliminant tasca" });
    });
};
