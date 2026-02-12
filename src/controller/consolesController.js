// Este archivo implementa las operaciones que se han definido en el /router/consolesRouter.js

const {findAllConsoles, findConsoleById} = require('../service/consolesService.js');

/**
 * Obtiene el listado completo de los videojeugos.
 * Devuelve un JSON estandarizado con el array de juegos en el campo 'data'.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar el control al siguiente middleware.
 * @returns {Promise<void>} Devuelve una respuesta JSON con codigo 200 y los datos..
 */
const getAllConsoles = async (req, res, next) => {
    try {
        const consoles = await findAllConsoles();
        res.status(200).json({
            code: 200,
            title: 'success',
            message: 'Consoles retrieved successfully',
            data: consoles
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Obtiene el detalle de una consola especifica por su ID.
 * Valida si el juego existe antes de devolver la respuesta.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con codigo 200 y los datos del juego o 404 si no existe..
 */
const getConsoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const console = await findConsoleById(id);
        if (!console) {
            return res.status(404).json({
                code: 404,
                title: 'not found',
                message: `Videogame with id ${id} not found`
            })
        }
        res.status(200).json({
            code: 200,
            title: 'success',
            message: 'Console retrieved successfully',
            data: console
        })
        } catch (error) {
            next(error);
        }
}

module.exports = {
    getAllConsoles,
    getConsoleById
}
