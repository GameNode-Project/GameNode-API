// Archivo que contiene la lista de todas las operaciones definidas en el /controller/companiesController.js

const express = require("express");
const router = express.Router();

const {
  getAllCompanies,
  getCompanyById,
  postCompany,
  putCompany,
  deleteCompany,
} = require("../controller/companiesController");
const {
  validateCompanyId,
  validateAddCompany,
  validateUpdateCompany,
} = require("../validators/companies");

// Rutas
router.get("/", getAllCompanies);
router.get("/:id", validateCompanyId, getCompanyById);
router.post("/", validateAddCompany, postCompany);
router.put("/:id", validateUpdateCompany, putCompany);
router.delete("/:id", validateCompanyId, deleteCompany);

module.exports = router;
