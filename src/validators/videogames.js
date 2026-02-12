// Archivo de validaciones

const { param } = require('express-validator');
const { validateResult } = require('../middlewares/validateResult');

/**
 * Cadena de validaciones para operaciones que requieren un ID de videojuego.
 * Se aplica a rutas dinámicas como GET /:id.
 * * Reglas:
 * 1. El parámetro 'id' debe existir en la URL.
 * 2. El parámetro 'id' debe ser un número entero mayor que 0.
 */
const validateVideogameId = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isInt({ gt: 0 }).withMessage('ID must be a positive integer'),

  validateResult
];

module.exports = {
  validateVideogameId
}