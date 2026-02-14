// Archivo de validaciones

const { param, body } = require('express-validator');
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

/**
 * Cadena de validaciones para la creación de un nuevo videojuego.
 * Se aplica a la ruta POST /.
 * * Reglas:
 * 1. 'title' es obligatorio, debe ser una cadena de texto entre 2 y 100 caracteres.
 * 2. 'description' es obligatorio, debe ser una cadena de texto de máximo 255 caracteres.
 * 3. 'genre' es obligatorio, debe ser una cadena de texto de máximo 50 caracteres.
 * 4. 'release_date' es obligatorio, debe ser una fecha válida en formato ISO (YYYY-MM-DD).
 * 5. 'pegi_rating' es obligatorio, debe ser uno de los valores permitidos (PEGI 3, 7, 12, 16, 18).
 * 6. 'price' es obligatorio, debe ser un número decimal positivo.
 * 7. 'url' es obligatorio, debe ser una URL válida.
 * 8. 'company_id' es obligatorio, debe ser un número entero positivo.
 * 9. 'consoles' es opcional, pero si se proporciona, debe ser un array de números enteros positivos.
 * 10. Cada elemento de 'consoles' debe ser un número entero positivo.
 */
const validateAddVideogame = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Title must be between 2 and 100 characters long'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ max: 255}).withMessage('Description must be at most 255 characters long'),
  
  body('genre')
    .trim()
    .notEmpty().withMessage('Genre is required')
    .isString().withMessage('Genre must be a string')
    .isLength({ max: 50 }).withMessage('Genre must be at most 50 characters long'),

  body('release_date')
    .notEmpty().withMessage('Release date is required')
    .isISO8601().withMessage('Release date must be in YYYY-MM-DD format')
    .toDate(), 

  body('pegi_rating')
    .trim()
    .notEmpty().withMessage('PEGI rating is required')
    .isIn(['PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18'])
    .withMessage('Invalid PEGI rating. Allowed: PEGI 3, 7, 12, 16, 18'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

  body('url')
    .notEmpty().withMessage('Image URL is required')
    .isURL().withMessage('Must be a valid URL'),

  body('company_id')
    .notEmpty().withMessage('Company ID is required')
    .isInt({ gt: 0 }).withMessage('Company ID must be a valid integer'),

  body('consoles')
    .optional() 
    .isArray().withMessage('Consoles must be an array of IDs'),
  
  body('consoles.*')
    .isInt({ gt: 0 }).withMessage('Each console ID must be a positive integer'),

  validateResult
]

/**
 * Cadena de validaciones para la actualización completa de un videojuego.
 * Se aplica a la ruta PUT /:id.
 * * Reglas:
 * 1. El parámetro 'id' debe existir en la URL y ser un número entero positivo.
 * 2. El cuerpo de la petición debe cumplir las mismas reglas que la creación (POST).
 */
const validateUpdateVideogame = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  
  ...validateAddVideogame.slice(0, -1),

  validateResult
]

module.exports = {
  validateVideogameId,
  validateAddVideogame,
  validateUpdateVideogame
}