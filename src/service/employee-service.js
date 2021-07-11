const _ = require("lodash");
const { HTML_STATUS_CODE } = require("./../config.json");
const res = require("../utils/custom-response");
const employeeDAO = require("../dao/employee-dao");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const EmployeeService = {

    async registerEmployee(employeeDetails) {
        try {
            if (!employeeDetails) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));

            const { email, password, mobile } = employeeDetails;
            const employeeExist = await employeeDAO.getByEmailOrMobile(email, mobile);
            if (employeeExist) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Employee already registered."));

            const salt = await bcrypt.genSalt(10);
            employeeDetails.password = await bcrypt.hash(password, salt);
            employeeDetails.employeeId = shortid.generate();
            const createdEmployee = await employeeDAO.create(employeeDetails);

            if (!createdEmployee) return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, "Something went wrong while registering employing"));
            return (createdEmployee, _.pick(createdEmployee, ["_id", "role", "name", "mobile", "email", "password", "customerType", "employeeId", "company"]));
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async login(employeeDetails) {
        try {
            if (!employeeDetails) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));

            const { email, password, mobile } = employeeDetails;
            const employee = await employeeDAO.getEmployee(email, mobile);
            if (!employee) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Employee not registered."));

            const checkPassword = await employee.verifyPassword(password, employee.password);
            if (!checkPassword) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Invalid Email/Password"));

            const token = await employee.generateAuthToken();
            return { token, employee: _.pick(employee, ["_id", "role", "employeeId", "name", "email", "mobile", "company", "reportingManager"]), };
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async getEmployees(condition) {
        try {
            if (!condition) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));
            const employees = await employeeDAO.find(condition);
            if (!employees.length) return Promise.reject(res.error(HTML_STATUS_CODE.NOT_FOUND, "No Employees registered yet!."));
            return employees;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async getSingleEmployee(condition) {
        try {
            if (!condition) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));
            const employee = await employeeDAO.getByEmployeeId(condition);
            if (!employee) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Employee found!."));
            return employee;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async updateEmployee(empId, condition) {
        try {
            if (!condition || !empId) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));
            const employee = await employeeDAO.getByEmployeeId(empId);
            if (!employee) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Employee found!."));
            const updateEmp = await employeeDAO.update({ employeeId: employee.employeeId }, condition);
            return updateEmp;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async updateSubordinates(empId, condition) {
        try {
            if (!condition || !empId) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));
            const employee = await employeeDAO.getByEmployeeId(empId);
            if (!employee) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Employee found!."));
            const updateEmp = await employeeDAO.updateSubordinates({ employeeId: employee.employeeId }, condition);
            return updateEmp;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async deleteEmployee(empId) {
        try {
            if (!empId) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));
            const employee = await employeeDAO.getByEmployeeId(empId);
            if (!employee) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Employee found!."));
            const delEmp = await employeeDAO.delete({ employeeId: employee.employeeId });
            return delEmp;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async searchEmployee(companyId, data) {
        try {
            if (!companyId || !data) return Promise.reject(res.error(HTML_STATUS_CODE.INVALID_DATA, "Invalid Data"));
            const employees = await employeeDAO.search(companyId, data);
            if (!employees) return Promise.reject(res.error(HTML_STATUS_CODE.NOT_FOUND, "No Employee found yet!."));
            return employees;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

};

module.exports = EmployeeService;