// Este archivo contiene la lista de todas las operaciones definidas en el /controller/consolesController.js

const express = require('express');
const router = express.Router();

const { getAllConsoles, getConsoleById, postConsole, putConsole, deleteConsole } = require('../controller/consolesController.js');
const { validateConsoleId, validateAddConsole, validateUpdateConsole } = require('../validators/consoles.js');

// RUTAS
router.get('/', getAllConsoles);
router.get('/:id', validateConsoleId, getConsoleById);
router.post('/', validateAddConsole, postConsole);
router.put('/:id', validateUpdateConsole, putConsole);
router.delete('/:id', validateConsoleId, deleteConsole);

module.exports = router;