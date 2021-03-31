const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    dept: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: Number,
    },
    accessLevel: {
      type: Number,
    },
  },
  {
    timestamps: { currentTime: () => Date() },
    collection: "user",
  }
);

module.exports = mongoose.model("User", userSchema);
