const EmployeeModel = require("../model/employee-schema");

// For Create Employee
exports.create = (employeeDetail) => {
    return new EmployeeModel(employeeDetail).save();
};

exports.getByMobile = (mobile) => {
    return EmployeeModel.findEmployee("mobile", mobile).populate('company reportingManager subordinates').select('-password');
};

exports.getByEmail = (email) => {
    return EmployeeModel.findEmployee("email", email).populate('company reportingManager subordinates').select('-password');
};

exports.getByEmployeeId = (employeeId) => {
    return EmployeeModel.findEmployee("employeeId", employeeId).populate('company reportingManager subordinates').select('-password');
};

exports.getByEmailOrMobile = (email, mobile, _id) => {
    return EmployeeModel.findOne({ $or: [{ email: email }, { mobile: mobile }, { _id: _id }] }).populate('company reportingManager subordinates').select('-password');
};

exports.getEmployee = (email, mobile, _id) => {
    return EmployeeModel.findOne({ $or: [{ email: email }, { mobile: mobile }, { _id: _id }] });
};

exports.findOneByCondition = (fieldName, value) => {
    return EmployeeModel.findEmployee(fieldName, value).populate('company reportingManager subordinates').select('-password');
};

exports.find = (condition) => {
    return EmployeeModel.find(condition).populate('company reportingManager subordinates').select('-password');
};

exports.update = (condition, updateFields) => {
    return EmployeeModel.updateOne(condition, { $set: updateFields });
};

exports.updateSubordinates = (condition, updateFields) => {
    return EmployeeModel.updateOne(condition, { $addToSet: { subordinates: updateFields.subordinates } });
};

exports.delete = (condition) => {
    return EmployeeModel.deleteOne(condition);
};

exports.search = (company, condition) => {
    const { email, mobile, name, employeeId } = condition;
    return EmployeeModel.find({
        $and: [{
            company,
            $or: [{ email }, { mobile }, { name }, { employeeId }]
        }]
    }).populate('company reportingManager subordinates');
};