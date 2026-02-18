// Archivo de validacion

const { param,body } = require('express-validator');
const { validateResult } = require('../middlewares/validateResult');

/**
 * Cadena de validaciones para operaciones que requiren un ID de empresa.
 * Se aplica a rutas dinámicas como GET /:id.
 * * Reglas:
 * 1 el id debe existir en la url
 * 2 el id debe ser numero entro y mayor que 0
 */
const validateCompanyId = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isInt({ gt: 0 }).withMessage('ID must be a positive integer'),

    validateResult
];

//validar por post company, putcompany, deletecompany

const validateAddCompany = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ max: 100 }).withMessage('Name must be at most 100 characters long'),
    
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
        .isLength({ max: 255 }).withMessage('Description must be at most 255 characters long'),
    
    body('country')
        .notEmpty().withMessage('Country is required')
        .isString().withMessage('Counry must be a string')
        .isLength({ max: 50 }).withMessage('Country must be at most 50 characters long'),

    body('year_founded')
        .notEmpty().withMessage('Year founded is required')
        .isInt({ min: 1800, max: new Date().getFullYear() }).withMessage(`Year founded must be an integer between 1800 and ${new Date().getFullYear()}`),

    body('website')
        .notEmpty().withMessage('Website is required')
        .isString().withMessage('Website must be a string')
        .isLength({ max: 255 }).withMessage('Website must be at most 255 characters long'),

    validateResult
];

const validateUpdateCompany = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isInt({ gt: 0 }).withMessage('ID must be a positive integer'),

    ...validateAddCompany.slice(0, -1), // Reutilizamos las validaciones de addCompany excepto el validateResult

    validateResult
];

module.exports = {
    validateCompanyId,
    validateAddCompany,
    validateUpdateCompany
}