// Archivo de validaciones

const { param, body } = require("express-validator");
const { validateResult } = require("../middlewares/validateResult.js");

/**
 * Cadena de validaciones para operaciones que requieren un ID de consola.
 * Se aplica a rutas dinamicas como GET /:id.
 * * Reglas:
 * 1. El parametro 'id' debe existir en la URL.
 * 2. El parametro 'id' debe ser un numero entero mayor que 0
 */

const validateConsoleId = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isInt({ gt: 0 })
    .withMessage("id must be a positive integer"),

  validateResult,
];

/**
 * Cadena de validaciones para la creación de una nueva consola.
 * Se aplica a la ruta POST /.
 * * Reglas:
 * 1. El campo 'name' es obligatorio y debe ser una cadena de texto y tener entre 2 y 100 caracteres.
 * 2. El campo 'description' es obligatorio y debe ser una cadena de texto y tener entre 10 y 255 caracteres.
 * 3. El campo 'release_date' es obligatorio y debe ser una fecha en formato YYYY-MM-DD.
 * 4. El campo 'url' es obligatorio y debe ser una URL válida.
 * 5. El campo 'company_id' es obligatorio y debe ser un número entero positivo.
 * 6. El campo 'videogames' es opcional, pero si se proporciona, debe ser un array de IDs de videojuegos (números enteros positivos).
 * 7. Cada ID de videojuego en el array 'videogames' debe ser un número entero positivo.
 */
const validateAddConsole = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 10, max: 255 })
    .withMessage("Description must be between 10 and 255 characters"),

  body("release_date")
    .trim()
    .notEmpty()
    .withMessage("Release date is required")
    .isISO8601()
    .withMessage("Release date must be in YYYY-MM-DD format"),

  body("url")
    .notEmpty()
    .withMessage("URL is required")
    .isURL()
    .withMessage("URL must be a valid URL"),

  body("company_id")
    .notEmpty()
    .withMessage("Company_id is required")
    .isInt({ gt: 0 })
    .withMessage("Company_id must be a positive integer"),

  body("videogames")
    .optional()
    .isArray()
    .withMessage("Videogames must be an array of videogame IDs"),

  body("videogames.*")
    .isInt({ gt: 0 })
    .withMessage("Each videogame ID must be a positive integer"),

  validateResult,
];

/**
 * Cadena de validaciones para la actualización completa de una consola.
 * Se aplica a la ruta PUT /:id
 * * Reglas:
 * 1. El párametro 'id' debe existir en la URL y ser un número entero positivo.
 * 2. El cuerpo de la petición debe cumplir las mismas reglas que la creación (POST)
 */
const validateUpdateConsole = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt({ gt: 0 })
    .withMessage("ID must be a positive integer"),

  ...validateAddConsole.slice(0, -1),

  validateResult,
];

module.exports = {
  validateConsoleId,
  validateAddConsole,
  validateUpdateConsole,
};
