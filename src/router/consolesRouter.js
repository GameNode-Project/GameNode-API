// Este archivo contiene la lista de todas las operaciones definidas en el /controller/consolesController.js

const express = require('express');
const router = express.Router();

const { getAllConsoles, getConsoleById, postConsole } = require('../controller/consolesController.js');
const { validateConsoleId, validateAddConsole } = require('../validators/consoles.js');

// Rutas

router.get('/', getAllConsoles);
router.get('/:id', validateConsoleId, getConsoleById);
router.post('/', validateAddConsole, postConsole);

module.exports = router;