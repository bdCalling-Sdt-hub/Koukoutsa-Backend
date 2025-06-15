const httpStatus = require("http-status");
const { paymentService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


const createPayment = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const payment = await paymentService.createPayment(req.body, _id);

    res.status(httpStatus.CREATED).json(
        response({
            message: "Payment created",
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: payment,
        })
    );
});


const getAllPayment = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const payment = await paymentService.getAllPayment(_id);
    res.status(httpStatus.OK).json(
        response({
            message: "Payment retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: payment,
        })
    );
});

const getIncomeStatistics = catchAsync(async (req, res) => {

    const payment = await paymentService.getIncomeStatistics();

    res.status(httpStatus.OK).json(
        response({
            message: "Payment retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: payment,
        })
    );
});

const getTotalUserAndTotalIncome = catchAsync(async (req, res) => {
    const { totalUsers, totalIncome } = await paymentService.getTotalUserAndTotalIncome();
    res.status(httpStatus.OK).json(
        response({
            message: "Payment retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: { totalUsers, totalIncome },
        })
    );
});


module.exports = {
    createPayment,
    getAllPayment,
    getIncomeStatistics,
    getTotalUserAndTotalIncome
};