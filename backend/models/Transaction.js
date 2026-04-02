const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['credit', 'expense'],
    required: true,
  },
  item: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Education', 'Travel', 'Movie / Entertainment', 'Shopping', 'Bills', 'Other', 'Credit'],
    default: 'Other',
  },
  paidFor: {
    type: String,
    default: 'self',
  },
  paidBy: {
    type: String,
    default: 'self',
  },
  note: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
