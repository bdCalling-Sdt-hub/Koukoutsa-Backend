const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema(
    {
        content: {
            type: String,
            default: "",
            minlength: 0,
            maxlength: 2000,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Privacy", privacySchema);
