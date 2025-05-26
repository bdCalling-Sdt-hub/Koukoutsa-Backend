const Joi = require("joi");

const studentValidation = {
    createStudent: {
        body: Joi.object().keys({
            studentName: Joi.string().required(),
            studentImage: Joi.string(),
            contactPerson1Name: Joi.string().required(),
            contactPerson1Number: Joi.number().required(),
            contactPerson2Name: Joi.string(),
            contactPerson2Number: Joi.number()
        }),
    },
}

module.exports = { studentValidation };