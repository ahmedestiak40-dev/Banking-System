const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  balanceAfter: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 10000);
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);