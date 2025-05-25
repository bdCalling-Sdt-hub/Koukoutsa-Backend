const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: "",
      minlength: 0,
      maxlength: 2000
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model("AboutUs", aboutUsSchema);
