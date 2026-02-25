// Archivo que implementa las operaciones que se deficen en /router/companiesRouter.js

const {
  findAllCompanies,
  findCompanyById,
  addCompany,
  updateCompany,
  removeCompany,
} = require("../service/companiesService");

/**
 * Obtien el listado de todas las empresas.
 * Devuelve un JSON estandarizado con el array de empresas.
 * @param {Object} req - Objeto de petición de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON son código 200 y los datos
 */
const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await findAllCompanies();
    res.status(200).json({
      code: 200,
      title: "success",
      message: "Companies retrieved successfully",
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtine el detalle de una empresa por su id.
 * Valida si la empresa existe antes de devolver la respuesta.
 * @param {Object} req - Objeto de petición.
 * @param {Object} res - Objeto de respuesta.
 * @param {Function} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con codigo 200 y los datos de la empresa o 404 si no existe.
 */
const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await findCompanyById(id);
    if (!company) {
      return res.status(404).json({
        code: 404,
        title: "not-found",
        message: `Company with id ${id} not found`,
      });
    }
    res.status(200).json({
      code: 200,
      title: "success",
      message: "Company retrieved successfully",
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Agrega una nueva empresa a la base de datos.
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 201 y los datos de la empresa creada.
 */
const postCompany = async (req, res, next) => {
  try {
    const companyData = req.body;
    const newId = await addCompany(companyData);
    const newCompany = {
      id: newId,
      ...companyData,
    };

    res.status(201).json({
      code: 201,
      title: "created",
      message: `Company with name ${companyData.name} created successfully`,
      data: newCompany,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza los datos de una empresa por su ID.
 * Reemplaza los datos de una empresa con los dados en el cuerpo de la petición.
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 200 y los datos actualizados, o 404 si no se encuentra la empresa.
 */
const putCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyData = req.body;

    await updateCompany(id, companyData);

    const updatedCompany = await findCompanyById(id);

    if (!updatedCompany) {
      return res.status(404).json({
        code: 404,
        title: "not-found",
        message: `Company with id ${id} not found`,
      });
    }

    res.status(200).json({
      code: 200,
      title: "success",
      message: `Company with id ${id} updated successfully`,
      data: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una empresa por su ID.
 * @param {import('express').Request} req - Objeto de petición de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función middleware para manejo de errores.
 * @returns {Promise<void>} Devuelve una respuesta JSON con código 200 si la empresa ha sido eliminada, o 404 si no encuentra la empresa.
 */
const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCompany = await removeCompany(id);

    if (deletedCompany === 0) {
      return res.status(404).json({
        code: 404,
        title: "not-found",
        message: `Company with id ${id} not found`,
      });
    }
    res.status(200).json({
      code: 200,
      title: "success",
      message: `Company with id ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  postCompany,
  putCompany,
  deleteCompany,
};
