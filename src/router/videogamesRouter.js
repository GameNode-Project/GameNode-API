// Este archivo contiene la lista de todas las operaciones definidas en el /controller/videogamesController.js

const express = require('express');
const router = express.Router();

const { getAllVideogames, getVideogameById, postVideogame, putVideogame, deleteVideogame } = require('../controller/videogamesController');
const { validateVideogameId, validateAddVideogame, validateUpdateVideogame } = require('../validators/videogames');

// RUTAS
router.get('/', getAllVideogames);
router.get('/:id',validateVideogameId, getVideogameById );
router.post('/', validateAddVideogame, postVideogame);
router.put('/:id', validateUpdateVideogame, putVideogame);
router.delete('/:id', validateVideogameId, deleteVideogame);

module.exports = router;