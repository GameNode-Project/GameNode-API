// Este archivo implementa las operaciones que se han definido en el /router/consolesRouter.js

const {findAllConsoles, findConsoleById, addConsole, updateConsole, removeConsole } = require('../service/consolesService.js');

/**
 * Obtiene el listado completo de los videojeugos.
 * Devuelve un JSON estandarizado con el array de juegos en el campo 'data'.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
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
};

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
};

/**
 * Añade una nueva consola.
 * Recibe los datos validados en el cuerpo de la petición.
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 201 y los datos de la nueva consola.
 */
const postConsole = async (req, res, next) => {
    try {
        const newId = await addConsole(req.body);
        const newConsole = {
            id: newId,
            ...req.body
        };
        res.status(201).json({
            code: 201,
            title: 'created',
            message: 'Console created successfully',
            data: newConsole
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualiza los datos de una consola por su ID.
 * Reemplaza los datos de una consola con los dados en el cuerpo de la petición.
 * @param {import('express').Request} req - Objeto de petición.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 200 y los datos de la consola actualizada, o un error 404 si no se encuentra la consola.
 */
const putConsole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const consoleData = req.body;

        await updateConsole(id, consoleData);

        const updatedConsole = await findConsoleById(id);

        if (!updatedConsole) {
            return res.status(404).json({
                code: 404,
                title: 'not-found',
                message: `Console with id ${id} not found after update`
            });
        }

        res.status(200).json({
            code: 200,
            title: 'success',
            message: 'Console updated successfully',
            data: updatedConsole
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Elimina una consola por su id.
 * @param {*} req - Objeto de la peticion
 * @param {*} res - Objeto de la respuesta
 * @param {*} next - Función middleware para manejo de errores
 * @returns {Promise<void>} Devuelve una respuesta JSON con codigo 200 si se elimina correctamente o 404 si no se encuentra.
 */

const deleteConsole = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedCount = await removeConsole(id);

        if(deletedCount === 0) {
            return res.status(404).json({
                code: 404,
                title: 'not found', 
                message: `Console with id ${id} not found`
            });
        }

        res.status(200).json({
            code: 200,
            title: 'success',
            message: `Console with id ${id} deleted successfully`
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllConsoles,
    getConsoleById,
    postConsole,
    putConsole,
    deleteConsole
}
