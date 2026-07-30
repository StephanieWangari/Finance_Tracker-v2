const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: String,
  type: String, // income or expense
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);