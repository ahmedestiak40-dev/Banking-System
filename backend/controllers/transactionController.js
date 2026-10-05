const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

const transactionController = {
  deposit: async (req, res) => {
    try {
      console.log('Deposit request:', req.body);
      const { accountId, amount } = req.body;

      const account = await Account.findOne({ _id: accountId, userId: req.userId });
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      const depositAmount = parseFloat(amount);
      account.balance += depositAmount;
      await account.save();

      const transaction = new Transaction({
        accountId,
        type: 'deposit',
        amount: depositAmount,
        balanceAfter: account.balance
      });
      await transaction.save();

      console.log('Deposit successful. New balance:', account.balance);
      res.status(201).json({ transaction, account });
    } catch (error) {
      console.error('Deposit error:', error);
      res.status(500).json({ message: 'Deposit failed' });
    }
  },

  withdraw: async (req, res) => {
    try {
      const { accountId, amount } = req.body;
      const account = await Account.findOne({ _id: accountId, userId: req.userId });
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }

      const withdrawAmount = parseFloat(amount);
      if (account.balance < withdrawAmount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      account.balance -= withdrawAmount;
      await account.save();

      const transaction = new Transaction({
        accountId,
        type: 'withdrawal',
        amount: withdrawAmount,
        balanceAfter: account.balance
      });
      await transaction.save();

      console.log('Withdrawal successful. New balance:', account.balance);
      res.status(201).json({ transaction, account });
    } catch (error) {
      console.error('Withdrawal error:', error);
      res.status(500).json({ message: 'Withdrawal failed' });
    }
  },

  transfer: async (req, res) => {
    try {
      const { fromAccountId, toAccountNumber, amount } = req.body;
      
      const fromAccount = await Account.findOne({ _id: fromAccountId, userId: req.userId });
      if (!fromAccount) {
        return res.status(404).json({ message: 'Source account not found' });
      }

      const transferAmount = parseFloat(amount);
      if (fromAccount.balance < transferAmount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
      if (!toAccount) {
        return res.status(404).json({ message: 'Destination account not found' });
      }

      fromAccount.balance -= transferAmount;
      await fromAccount.save();

      toAccount.balance += transferAmount;
      await toAccount.save();

      const transactionOut = new Transaction({
        accountId: fromAccount._id,
        type: 'transfer',
        amount: transferAmount,
        balanceAfter: fromAccount.balance
      });
      await transactionOut.save();

      console.log('Transfer successful');
      res.status(201).json({ message: 'Transfer successful', fromAccount, toAccount });
    } catch (error) {
      console.error('Transfer error:', error);
      res.status(500).json({ message: 'Transfer failed' });
    }
  },

  getTransactionHistory: async (req, res) => {
    try {
      const { accountId } = req.params;
      console.log('Fetching transactions for account:', accountId);

      const transactions = await Transaction.find({ accountId })
        .sort({ createdAt: -1 })
        .limit(50);

      console.log('Found transactions:', transactions.length);
      res.json({ transactions });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Failed to fetch transactions' });
    }
  }
};

module.exports = transactionController;