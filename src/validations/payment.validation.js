const joi = require("joi");


const payment = {
    body: joi.object().keys({
        userId: joi.string().required(),
        amount: joi.number().required(),
        duration: joi.string().valid("month", "year").required(),
        expiresDate: joi.date().required(),
        paymentType: joi.string().valid("online", "offline").default("online"),
        subscriptionId: joi.string(),
        paymentStatus: joi.string().valid("pending", "success", "failed").default("pending"),
    }),
}

module.exports = payment
