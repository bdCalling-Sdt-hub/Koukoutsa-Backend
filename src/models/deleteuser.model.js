const mongoose = require("mongoose");

const deleteuserSchema = new mongoose.Schema(
    // name , email , reason 
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("DeleteUser", deleteuserSchema);