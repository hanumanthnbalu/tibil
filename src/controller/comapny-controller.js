const express = require("express");
const route = express.Router();
const { HTML_STATUS_CODE } = require("../config.json");
const CompanyService = require("../service/company-service");

// Registration Company
route.post("/register", (req, res) => {
    CompanyService
        .registerCompany(req.body)
        .then((result) => res.status(HTML_STATUS_CODE.CREATED).json({ message: "Company registered successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Get all Companies
route.get("/:companyId", (req, res) => {
    CompanyService
        .getSingleCompany(req.params.companyId)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Company fetched successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Get all Companies
route.get("/", (req, res) => {
    CompanyService
        .getCompanies(req.query)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Companies fetched successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Update Company
route.put("/:companyId", (req, res) => {
    CompanyService
        .updateCompany(req.params.companyId, req.body)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Company updated successfully." }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});


// Delete Company
route.delete("/:companyId", (req, res) => {
    CompanyService
        .deleteCompany(req.params.companyId)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Company deleted successfully." }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});



module.exports = route;