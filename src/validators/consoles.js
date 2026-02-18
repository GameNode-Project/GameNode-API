// Archivo de validaciones 

const { param, body } = require('express-validator');
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

/**
 * Cadena de validaciones para la ruta POST /, que añade una nueva consola.
 * Se aplican las siguientes reglas de validación:
 * 1. El campo 'name' es obligatorio y debe ser una cadena de texto y tener entre 2 y 100 caracteres.
 * 2. El campo 'description' es obligatorio y debe ser una cadena de texto y tener entre 10 y 255 caracteres.
 * 3. El campo 'release_date' es obligatorio y debe ser una fecha en formato YYYY-MM-DD.
 * 4. El campo 'url' es obligatorio y debe ser una URL válida.
 * 5. El campo 'company_id' es obligatorio y debe ser un número entero positivo.
 * 6. El campo 'videogames' es opcional, pero si se proporciona, debe ser un array de IDs de videojuegos (números enteros positivos).
 * 7. Cada ID de videojuego en el array 'videogames' debe ser un número entero positivo.
 * 8. Si alguna de las validaciones falla, se devuelve un error con un mensaje descriptivo.
 * 9. Si todas las validaciones pasan, se llama a la función validateResult para procesar los resultados de la validación.
 * 10. Esta cadena de validaciones se utiliza como middleware en la ruta POST / del router de consolas.
 */

const validateAddConsole = [
    body('name')
        .trim()
        .notEmpty().withMessage('name is required')
        .isString().withMessage('name must be a string')
        .isLength({min: 2, max: 100}).withMessage('name must be between 2 and 100 characters'),

    body('description')    
        .trim()
        .notEmpty().withMessage('description is required')
        .isString().withMessage('description must be a string')
        .isLength({min: 10, max: 255}).withMessage('description must be between 10 and 255 characters'),

    body('release_date')
        .trim()
        .notEmpty().withMessage('release_date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('release_date must be in YYYY-MM-DD format'),
        
    body('url')
        .notEmpty().withMessage('url is required')
        .isURL().withMessage('url must be a valid URL'),

    body('company_id')
        .notEmpty().withMessage('company_id is required')
        .isInt({ gt: 0 }).withMessage('company_id must be a positive integer'),
    
    body('videogames')
        .optional()
        .isArray().withMessage('videogames must be an array of videogame IDs'),

    body('videogames.*')
        .isInt({ gt: 0 }).withMessage('each videogame ID must be a positive integer'),

    validateResult
];

/**
 * Cadena de validaciones para la actualizacion completa de una consola
 * Se aplica a la ruta PUT /:id
 * Reglas:
 * 1. El parametro 'id' debe existir en la URL.
 * 2. El cuerpo de la peticion debe cumplir las mismas reglas que la creacion (POST)
 */

const validateUpdateConsole = [
    param('id')
        .notEmpty().withMessage('id is required')
        .isInt({ gt: 0 }).withMessage('id must be a positive integer'),

    ...validateAddConsole.slice(0, -1), 

    validateResult
]

module.exports = {
    validateConsoleId,
    validateAddConsole,
    validateUpdateConsole
}