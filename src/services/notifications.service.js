const { Notification } = require("../models");


const getAllNotifications = async (req, res, next) => {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    const unread = await Notification.find({ status: "unread" });
    return { notifications, unread: unread.length };
};

const unreadNotification = async (id) => {
    // Find the notification with the provided id
    const notifications = await Notification.find({ _id: id });

    // Update the specific notification to "read"
    await Notification.updateOne({ _id: id }, { status: "read" });

    // Return the found notifications
    return notifications;
};


module.exports = {
    getAllNotifications,
    unreadNotification
};