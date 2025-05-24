const Joi = require("joi");


// with this data we can create a new class

const schoolValidation = {
    createSchool: {
        body: Joi.object().keys({
            schoolId: Joi.string(),
            className: Joi.string().required(),
            teacher: Joi.string().required(),
            setAlertTime: Joi.date().required(),
            totalStudents: Joi.number(),
            studentsIds: Joi.array().items(Joi.string()),
        }),
    },
}

const addStudent = {
    body: Joi.object().keys({
        classId: Joi.string().required(),
        studentId: Joi.string().required(),
    }),
}

module.exports = { schoolValidation, addStudent };

