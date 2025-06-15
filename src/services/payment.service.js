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

    // const result = await Payment.aggregate([
    //     {
    //         $match: {
    //             date: { $gte: last7Days } // Filter payments from the last 7 days
    //         }
    //     },
    //     {
    //         $project: {
    //             amount: 1, // Assuming 'amount' is the field for income in the Payment model
    //             day: {
    //                 $dayOfYear: { $dateFromString: { dateString: "$date" } } // Extract day of the year
    //             },
    //             year: { $year: { $dateFromString: { dateString: "$date" } } } // Extract year from the date
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: { year: "$year", day: "$day" }, // Group by year and day
    //             totalIncome: { $sum: "$amount" } // Sum the amount for each day
    //         }
    //     },
    //     {
    //         $sort: { "_id.year": -1, "_id.day": -1 } // Sort by year and day in descending order
    //     }
    // ]);

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