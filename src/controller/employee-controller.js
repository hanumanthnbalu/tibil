const express = require("express");
const route = express.Router();
const { HTML_STATUS_CODE } = require("./../config.json");
const EmployeeService = require("./../service/employee-service");
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');

// Registration Employee
route.post("/register", (req, res) => {
    EmployeeService
        .registerEmployee(req.body)
        .then((result) => res.status(HTML_STATUS_CODE.CREATED).json({ message: "Employee registered successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Login Employee
route.post("/login", (req, res) => {
    EmployeeService
        .login(req.body)
        .then((result) => res.status(HTML_STATUS_CODE.CREATED).json({ message: "logged in successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Get all Employees
route.get("/:employeeId", [isAuth, isAdmin], (req, res) => {
    EmployeeService
        .getSingleEmployee(req.params.employeeId)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Employee fetched successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Get all Employees
route.get("/", [isAuth, isAdmin], (req, res) => {
    EmployeeService
        .getEmployees(req.query)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Employees fetched successfully.", data: result }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Update Employee
route.put("/:employeeId", [isAuth, isAdmin], (req, res) => {
    EmployeeService
        .updateEmployee(req.params.employeeId, req.body)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Employee updated successfully." }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Update subordinates
route.put("/subordinates/:employeeId", [isAuth, isAdmin], (req, res) => {
    EmployeeService
        .updateSubordinates(req.params.employeeId, req.body)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Subordinates updated successfully." }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});


// Delete Employee
route.delete("/:employeeId", [isAuth, isAdmin], (req, res) => {
    EmployeeService
        .deleteEmployee(req.params.employeeId)
        .then((result) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Employee deleted successfully." }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});

// Search Employee within company
route.get("/search/:companyId", [isAuth, isAdmin], (req, res) => {
    EmployeeService
        .searchEmployee(req.params.companyId, req.query)
        .then((data) => res.status(HTML_STATUS_CODE.SUCCESS).json({ message: "Employee fetched successfully.", data }))
        .catch((error) => res.status(error.status || HTML_STATUS_CODE.INTERNAL_ERROR).json(error));
});



module.exports = route;