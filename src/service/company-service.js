const _ = require("lodash");
const { HTML_STATUS_CODE } = require("../config.json");
const res = require("../utils/custom-response");
const companyDAO = require("../dao/company-dao");
const shortid = require("shortid");

const CompanyService = {

    async registerCompany(companyDetails) {
        try {
            if (!companyDetails) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Invalid Data"));

            const { name } = companyDetails;
            const companyExist = await companyDAO.getByName(name);
            if (companyExist) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Company already registered."));
            companyDetails.companyId = shortid.generate();
            const createdCompany = await companyDAO.create(companyDetails);

            if (!createdCompany) return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, "Something went wrong while creating comapny"));
            return createdCompany;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async getCompanies(condition) {
        try {
            if (!condition) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Invalid Data"));
            const companies = await companyDAO.find(condition);
            if (!companies) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No companies registered yet!."));
            return companies;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async getSingleCompany(condition) {
        try {
            if (!condition) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Invalid Data"));
            const company = await companyDAO.getByCompanyId(condition);
            if (!company) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Company found!."));
            return company;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async updateCompany(empId, condition) {
        try {
            if (!condition || !empId) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Invalid Data"));
            const company = await companyDAO.getByCompanyId(empId);
            if (!company) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Company found!."));
            const updateCompany = await companyDAO.update({ companyId: company.companyId }, condition);
            return updateCompany;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

    async deleteCompany(empId) {
        try {
            if (!empId) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "Invalid Data"));
            const company = await companyDAO.getByCompanyId(empId);
            if (!company) return Promise.reject(res.error(HTML_STATUS_CODE.BAD_REQUEST, "No Company found!."));
            const delCompany = await companyDAO.delete({ companyId: company.companyId });
            return delCompany;
        } catch (error) {
            return Promise.reject(res.error(HTML_STATUS_CODE.INTERNAL_ERROR, error.message, error.stack));
        }
    },

};

module.exports = CompanyService;