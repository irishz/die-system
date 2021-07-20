const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let dieTransSchema = new Schema({
  item: {
    type: String,
  },
  locdie: {
    type: String,
  },
  trans_type: {
    type: String,
  },
  trans_date: {
    type: Date,
  },
});

module.exports = mongoose.model("die_trans", dieTransSchema);
