// Archivo de validaciones 

const { param } = require('express-validator');
const { validateResult } = require('../middlewares/validateResult.js');

/**
 * Cadena de validaciones para operaciones que requieren un ID de consola.
 * Se aplica a rutas dinamicas como GET /:id.
 * * Reglas:
 * 1. El parametro 'id' debe existir en la URL.
 * 2. El parametro 'id' debe ser un numero entero mayor que 0
 */
const validateConsoleId = [
    param('id')
        .notEmpty().withMessage('id is required')
        .isInt({ gt: 0 }).withMessage('id must be a positive integer'),
    
    validateResult
];

module.exports = {
    validateConsoleId
}