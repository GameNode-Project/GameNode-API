// Este archivo contiene la lista de todas las operaciones definidas en el /controller/videogamesController.js

const express = require('express');
const router = express.Router();

const { getAllVideogames, getVideogameById } = require('../controller/videogamesController');
const { validateVideogameId } = require('../validators/videogames');

// RUTAS
router.get('/', getAllVideogames);
router.get('/:id',validateVideogameId, getVideogameById );

module.exports = router;