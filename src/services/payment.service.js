const httpStatus = require("http-status");
const { Payment, User, Notification } = require("../models");
const ApiError = require("../utils/ApiError");


const createPayment = async (body, userId) => {

    const findUser = await User.findById(userId);

    if (!findUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Update user subscription fields without await
    findUser.subscriptionId = body.subscriptionId;
    findUser.isSubscribed = true;
    findUser.subscriptionEndDate = new Date(); // consider setting to future date if needed

    await findUser.save();
    const result = await Payment.create({ ...body, userId });

    await Notification.create({
        userId: userId,
        content: "Your payment has been successful",
        type: "success",
    });


    return result;
}

const getAllPayment = async (userId) => {
    const result = await Payment.find({ userId });
    return result;
}


module.exports = {
    createPayment,
    getAllPayment
}