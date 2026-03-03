const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    tableId: { type: String, required: true },
    items: [
      {
        name: String,
        qty: Number,
      },
    ],
    total: Number,
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);