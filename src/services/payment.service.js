const httpStatus = require("http-status");
const { Payment, User, Notification } = require("../models");
const ApiError = require("../utils/ApiError");


const createPayment = async (body, userId) => {

    console.log(body.subscriptionId);

    const findUser = await User.findById(userId);

    if (!findUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Update user subscription fields without await
    findUser.subscriptionId = body.subscriptionId;
    findUser.isSubscribed = true;
    findUser.subscriptionEndDate = body.expiresDate; // consider setting to future date if needed

    await findUser.save();
    const result = await Payment.create({ ...body, userId });

    await Notification.create({
        userId: userId,
        content: `User payment has been successful ${body.amount} EUR for a ${body.duration} plan`,
        type: "success",
    });

    return result;
}

const getAllPayment = async (userId) => {
    const result = await Payment.find({ userId });
    return result;
}

const getIncomeStatistics = async () => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7); // Get the date for 7 days ago

    const result = await Payment.find({}).sort({ date: -1 }).limit(30);

    return result;
};


const getTotalUserAndTotalIncome = async () => {
    const result = await Payment.aggregate([
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$amount" }
            }
        }
    ]);

    const totalUsers = await User.find({ role: "user", isDeleted: false });

    return {
        totalUsers: totalUsers.length,
        totalIncome: result[0]?.totalIncome || 0
    };

}


module.exports = {
    createPayment,
    getAllPayment,
    getIncomeStatistics,
    getTotalUserAndTotalIncome
}