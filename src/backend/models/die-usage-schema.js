const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dieusageSchema = new Schema(
  {
    job: {
      type: String,
    },
    item: {
      type: String,
    },
    locdie: {
      type: String,
    },
    mcno: {
      type: String,
    },
    status: {
      type: String,
    },
    checkDie: {
      type: Object,
    },
    requestBy: {
      type: String,
    },
    issuedBy: {
      type: String,
    },
    issuedAt: {
      type: Date,
    },
    recievedBy: {
      type: String,
    },
    recievedAt: {
      type: Date,
    },
  },
  {
    timestamps: { currentTime: () => Date() },
    collection: "die_usage",
  }
);

module.exports = mongoose.model("dieUsage", dieusageSchema);
