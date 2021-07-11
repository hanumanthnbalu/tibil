const _ = require("lodash");
const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ROLE, APP_SECRETE } = require("../config.json");
const modelName = "employees";
const Schema = mongoose.Schema;

// Create Schema objects and set validations
const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
        unique: true,
    },
    employeeId: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 10,
        maxlength: 10,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    role: {
        type: String,
        required: true,
        enum: ROLE,
        uppercase: true,
        default: "EMPLOYEE",
    },
    reportingManager: {
        type: Schema.Types.ObjectId,
        ref: "employees"
    },
    subordinates: [
        {
            type: Schema.Types.ObjectId,
            ref: "employees"
        }
    ],
    company: {
        type: Schema.Types.ObjectId,
        ref: "companies",
        required: true
    },
});

// Find one employee by specific field
EmployeeSchema.statics.findEmployee = function (findBy, value) {
    return this.model(modelName).findOne({ [findBy]: value });
};

EmployeeSchema.pre(/^find/, function (next) {
    this.find({}).select("-__v");
    next();
});


function validateEmployee(employee) {
    const schema = {
        employeeId: Joi.string().min(2).max(50).required(),
        name: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(2).max(255).required(),
        mobile: Joi.string().min(10).max(10).required(),
        role: Joi.string().required(),
    };

    return Joi.validate(employee, schema);
}

EmployeeSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            role: this.role,
            mobile: this.mobile,
            employeeId: this.employeeId
        },
        APP_SECRETE
    );
    return token;
};

EmployeeSchema.methods.verifyPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = validateEmployee;
module.exports = mongoose.model(modelName, EmployeeSchema); //Compiling schema to model
