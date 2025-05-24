const Joi = require("joi");



const attendance = {
    body: Joi.object().keys({
        studentId: Joi.array().items(Joi.string()).required(),
    }),
}

module.exports = attendance
