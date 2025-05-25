const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
 
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
    },

  },

  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("Support", supportSchema);
