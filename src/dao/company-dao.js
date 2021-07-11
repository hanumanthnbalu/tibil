const CompanyModel = require("../model/company-schema");

// For Create Company
exports.create = (companyDetail) => {
    return new CompanyModel(companyDetail).save();
};

exports.getByCompanyId = (companyId) => {
    return CompanyModel.findCompany("companyId", companyId);
};

exports.getByName = (name) => {
    return CompanyModel.findOne({ name });
};

exports.findOneByCondition = (fieldName, value) => {
    return CompanyModel.findCompany(fieldName, value);
};

exports.find = (condition) => {
    return CompanyModel.find(condition);
};

exports.update = (condition, updateFields) => {
    return CompanyModel.updateOne(condition, { $set: updateFields });
};

exports.delete = (condition) => {
    return CompanyModel.deleteOne(condition);
};