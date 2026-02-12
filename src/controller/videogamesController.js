// Este archivo implementa todas las operaciones que se han definido en el /router/videogamesRouter.js

const { findAllVideogames, findVideogameById } = require('../service/videogamesService');

/**
 * Obtiene el listado completo de videojuegos.
 * Devuelve un JSON estandarizado con el array de juegos en el campo 'data'.
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 200 y los datos.
 */
const getAllVideogames = async (req, res, next) => {
  try {
    const videogames = await findAllVideogames();
    res.status(200).json({
      code: 200,
      title: 'success',
      message: 'Videogames retrieved successfully',
      data: videogames
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene el detalle de un videojuego específico por su ID.
 * Valida si el juego existe antes de devolver la respuesta.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Función middleware para manejo de errores..
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 200 y los datos del juego o 404 si no existe.
 */
const getVideogameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videogame = await findVideogameById(id);
    if (!videogame) {
      return res.status(404).json({
        code: 404,
        title: 'not-found',
        message: `Videogame with id ${id} not found`
      });
    }
    res.status(200).json({
      code: 200,
      title: 'success',
      message: 'Videogame retrieved successfully',
      data: videogame
    })
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllVideogames,
  getVideogameById
}
