const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("Table", tableSchema);