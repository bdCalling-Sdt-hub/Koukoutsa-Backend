const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        duration: {
            type: String, // month / year
            enam: ["month", "year"],
            required: true,
        },
        expiresDate: {
            type: Date,
            required: true
        },
        subscriptionId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Subscription",
            required: true, 
        },
        paymentType: {
            type: String,
            enum: ["online", "offline"],
            default: "online",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model("Payment", paymentSchema);