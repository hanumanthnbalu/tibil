const mongoose = require("mongoose");
const Joi = require("joi");
const modelName = "companies";
const Schema = mongoose.Schema;

// Create Schema objects and set validations
const CompanySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
        unique: true,
    },
    companyId: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 255,
        unique: true,
    }
});

// Find one Company by specific field
CompanySchema.statics.findCompany = function (findBy, value) {
    return this.model(modelName).findOne({ [findBy]: value });
};

CompanySchema.pre(/^find/, function (next) {
    this.find({}).select("-__v");
    next();
});


function validateCompany(company) {
    const schema = {
        companyId: Joi.string().min(2).max(50).required(),
        name: Joi.string().min(2).max(50).required()
    };
    return Joi.validate(company, schema);
}

module.exports = validateCompany;
module.exports = mongoose.model(modelName, CompanySchema); //Compiling schema to model
