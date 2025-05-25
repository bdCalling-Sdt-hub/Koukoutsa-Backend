const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        duration: {
            type: String,
            enum: ["month", "year"],
            required: true,
        },
        features: {
            type: [String],
            required: true,
            validate: [(val) => val.length > 0, "At least one feature is required"],
        },

        // Additional fields:
        isActive: {
            type: Boolean,
            default: true,
            description: "Indicates if the subscription plan is currently active",
        },

        trialPeriodDays: {
            type: Number,
            default: 0,
            max: 7,
            description: "Trial period in days before payment is required",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
