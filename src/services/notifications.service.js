const { Notification } = require("../models");


const getAllNotifications = async (req, res, next) => {
    const notifications = await Notification.find();
    const unread = await Notification.find({ status: "unread" });
    return { notifications, unread: unread.length };
};

const unreadNotification = async (id) => {
    const notifications = await Notification.find({ _id: id });

    await Notification.updateMany({ status: "read" });

    return notifications;
};

module.exports = {
    getAllNotifications,
    unreadNotification
};