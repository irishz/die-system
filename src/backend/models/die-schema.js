const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dieSchema = new Schema(
  {
    item: {
      type: String,
    },
    locdie: {
      type: String,
    }
  },
  {
    timestamps: { currentTime: () => Date() },
    collection: "die",
  }
);

module.exports = mongoose.model("die", dieSchema);
