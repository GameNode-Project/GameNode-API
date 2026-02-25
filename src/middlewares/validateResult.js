// Archivo de middleware para validar los resultados de las validaciones

// Importamos la función validationResult de express-validator
const { validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      title: "validation error",
      errors: errors.array(),
    });
  }

  next();
};

module.exports = { validateResult };