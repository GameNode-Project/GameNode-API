// Este archivo implementa todas las operaciones que se han definido en el /router/videogamesRouter.js

const { findAllVideogames, findVideogameById, addVideogame, updateVideogame, removeVideogame } = require('../service/videogamesService');

/**
 * Obtiene el listado completo de videojuegos.
 * Devuelve un JSON estandarizado con el array de juegos en el campo 'data'.
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
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
  };
};

/**
 * Obtiene el detalle de un videojuego específico por su ID.
 * Valida si el juego existe antes de devolver la respuesta.
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
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
  };
};

/**
 * Añade un nuevo videojuego.
 * Recibe los datos validados en el cuerpo de la petición.
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 201 y los datos del nuevo videojuego.
 */
const postVideogame = async (req, res, next) => {
  try {
    const newId = await addVideogame(req.body);
    const newVideogame = {
      id: newId,
      ...req.body
    };
    res.status(201).json({
      code: 201,
      title: 'created',
      message: 'Videogame created successfully',
      data: newVideogame
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza los datos de un videojuego por su ID.
 * Reemplaza los datos de un videojuego con los dados en el cuerpo de la petición.
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @return {Promise<void>} Devuelve una respuesta JSON con código 200 y los datos del videojuego actualizado, o 404 si no se encuentra el juego.
 */
const putVideogame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videogameData = req.body;

    await updateVideogame(id, videogameData);

    const updatedVideogame = await findVideogameById(id);

    if (!updatedVideogame) {
      return res.status(404).json({
        code: 404,
        title: 'not-found',
        message: `Videogame with id ${id} not found after update`
      });
    }

    res.status(200).json({
      code: 200,
      title: 'success',
      message: 'Videogame updated successfully',
      data: updatedVideogame
    });

  } catch (error) {
    next(error);
  };
};

/**
 * Elimina un videojuego por su ID. 
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @return {Promise<void>} Devuelve una respuesta JSON con código 200 si el videojuego ha sido eliminado, o 404 si no se encuentra el juego.
 */
const deleteVideogame = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await removeVideogame(id);

    if (deletedCount === 0) {
      return res.status(404).json({
        code: 404,
        title: 'not-found',
        message: `Videogame with id ${id} not found`
      });
    }

    res.status(200).json({
      code: 200,
      title: 'success',
      message: `Videogame with id ${id} deleted successfully`
    });

  } catch (error) {
    next(error);
  };
};

module.exports = {
  getAllVideogames,
  getVideogameById,
  postVideogame,
  putVideogame,
  deleteVideogame
}
