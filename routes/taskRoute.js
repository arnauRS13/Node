// routes/taskRoute.js

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");

// totes les rutes de tasks requereixen autenticacio
router.use(auth);

// crear tasca
router.post("/", taskController.createTask);

// obtenir totes les tasques
router.get("/", taskController.getTasks);

// obtenir una tasca per id
router.get("/:id", taskController.getTask);

// actualitzar tasca
router.put("/:id", taskController.updateTask);

// eliminar tasca
router.delete("/:id", taskController.deleteTask);

module.exports = router;
