// Archivo en el que accedemos a la base de datos a por la información requerida y realizamos las operaciones de lógica necesarias.

const db = require('../configuration/database').db;

/**
 * Metodo para obtener todas las empresas de la base de datos.
 * @returns {Promise<Array>} Devuelve una Promesa que resuelve en un arrray de objetos (empresas).
 */
const findAllCompanies = async () => {
    return await db('companies').select('*');
};

/**
 * Metiodo para obtener una empresa por su id.
 * @param {number} id 
 * @returns {Promise<Object>} Devuelve una Promesa con el objeto de la emprese, o null si no se encuentra.
 */
const findCompanyById = async (id) => {
    const company = await db('companies').where({ id: id }).first();
    if (!company) {return null; }
    return company;
};

/**
 * Agrega una nueva empresa a la base de datos.
 * @param {Object} companyData - Objeto con los datos validados de la empresa.
 * @returns {Promise<number>} Devuelve el ID de la empresa creada.
 */
const addCompany = async (companyData) => {
    const [newId] =  await db('companies').insert(companyData);
    return newId;
};

/**
 * Actualiza la información de una empresa existente.
 * @param {number} id - El ID de la empresa a actualizar.
 * @param {Object} companyData - Objeto con los datos actualizados de la empresa.
 * @returns {Promise<number>} Devuelve el número de filas afectadas (1 si se actualizó con éxito, 0 si no existía).
 */
const updateCompany = (async (id, companyData) => {
    return await db('companies')
      .where({ id })
      .update(companyData);
});

/**
 * Elimina una empresa por su id.
 * @param {number} id - El ID de la empresa a eliminar.
 * @returns {Promise<number>} Devuelve 1 si se eliminó la empresa, 0 si no se encontró.
 */
const removeCompany = async (id) => {
    return await db('companies').where({id}).del();
};

module.exports = {
    findAllCompanies,
    findCompanyById,
    addCompany,
    updateCompany,
    removeCompany
};