const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountType: { type: String, default: 'savings' },
  balance: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  openedAt: { type: Date, default: Date.now }
});

accountSchema.pre('save', function(next) {
  if (!this.accountNumber) {
    this.accountNumber = 'ACC' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Account', accountSchema);