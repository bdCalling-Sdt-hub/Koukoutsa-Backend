const httpStatus = require("http-status");
const { subscriptionService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


const createSubscription = catchAsync(async (req, res) => {
    const subscription = await subscriptionService.createSubscription(req.body);
    res.status(httpStatus.CREATED).json(
        response({
            message: "Subscription created",
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: subscription,
        })
    );
});

const getAllSubscription = catchAsync(async (req, res) => {
    const subscription = await subscriptionService.getAllSubscription();
    res.status(httpStatus.OK).json(
        response({
            message: "Subscription retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: subscription,
        })
    );
});

const getSubscriptionById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const find = await subscriptionService.getSubscriptionById(id);
    if (!find) {
        return res.status(httpStatus.NOT_FOUND).json(
            response({
                message: "Subscription not found",
                status: "Error",
                statusCode: httpStatus.NOT_FOUND,
            })
        );
    }

    const subscription = await subscriptionService.getSubscriptionById(id);
    res.status(httpStatus.OK).json(
        response({
            message: "Subscription retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: subscription,
        })
    );
});

const updateSubscription = catchAsync(async (req, res) => {
    const { id } = req.params;
    const subscription = await subscriptionService.updateSubscription(id, req.body);
    res.status(httpStatus.OK).json(
        response({
            message: "Subscription updated successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: subscription,
        })
    );
});

const deleteSubscription = catchAsync(async (req, res) => {
    const { id } = req.params;
    const subscription = await subscriptionService.deleteSubscription(id);
    res.status(httpStatus.OK).json(
        response({
            message: "Subscription deleted successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: subscription,
        })
    );
});

module.exports = {
    createSubscription,
    getAllSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
};