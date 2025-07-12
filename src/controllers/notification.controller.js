const httpStatus = require("http-status");
const { notificationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");


const getAllNotifications = catchAsync(async (req, res) => {
    const notifications = await notificationService.getAllNotifications();
    res.status(httpStatus.OK).json(
        response({
            message: "Notifications retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: notifications,
        })
    );
});

const unreadNotification = catchAsync(async (req, res) => {
    const { id } = req.params;
    const notifications = await notificationService.unreadNotification(id);
    res.status(httpStatus.OK).json(
        response({
            message: "Notifications retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: notifications,
        })
    );
});

const readAllNotifications = catchAsync(async (req, res) => {
    const notifications = await notificationService.readAllNotifications();
    res.status(httpStatus.OK).json(
        response({
            message: "All notifications marked as read successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: notifications,
        })
    );
});


module.exports = {
    getAllNotifications,
    unreadNotification,
    readAllNotifications
};