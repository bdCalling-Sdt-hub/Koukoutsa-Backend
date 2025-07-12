const { Subscription } = require("../models");


const createSubscription = async (data) => {
    const subscription = await Subscription.create(data);
    return subscription;
}

const getAllSubscription = async () => {
    const subscription = await Subscription.find().sort({ createdAt: -1 });
    return subscription;
}

const getSubscriptionById = async (id) => {
    const subscription = await Subscription.findById(id);
    return subscription;
}

const updateSubscription = async (id, data) => {
    const subscription = await Subscription.findByIdAndUpdate(id, data, { new: true });
    return subscription;
}

const deleteSubscription = async (id) => {
    const subscription = await Subscription.findByIdAndDelete(id);
    return subscription;
}



module.exports = {
    createSubscription,
    getAllSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
};