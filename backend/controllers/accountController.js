const Account = require('../models/Account');

const accountController = {
  getUserAccounts: async (req, res) => {
    try {
      console.log('Fetching accounts for user:', req.userId);
      const accounts = await Account.find({ userId: req.userId });
      console.log('Found accounts:', accounts.length);
      res.json(accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      res.status(500).json({ message: 'Failed to fetch accounts' });
    }
  },

  createAccount: async (req, res) => {
    try {
      console.log('Creating account for user:', req.userId);
      const { accountType = 'savings', initialDeposit = 0 } = req.body;

      const account = new Account({
        userId: req.userId,
        accountType,
        balance: parseFloat(initialDeposit) || 0
      });

      await account.save();
      console.log('Account created:', account.accountNumber);
      res.status(201).json(account);
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  }
};

module.exports = accountController;