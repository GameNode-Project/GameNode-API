// Este archivo contiene la lista de todas las operaciones definidas en el /controller/consolesController.js

const express = require('express');
const router = express.Router();

const { getAllConsoles, getConsoleById } = require('../controller/consolesController.js');
const { validateConsoleId } = require('../validators/consoles.js');

// Rutas

router.get('/', getAllConsoles);
router.get('/:id', validateConsoleId, getConsoleById);

module.exports = router;