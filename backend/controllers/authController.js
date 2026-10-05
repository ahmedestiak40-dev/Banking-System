const User = require('../models/User');
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      console.log('Register request:', req.body);
      const { firstName, lastName, email, password, phone } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({ firstName, lastName, email, password, phone });
      await user.save();

      const account = new Account({
        userId: user._id,
        accountType: 'savings',
        balance: 0
      });
      await account.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your_secret_key_here_123',
        { expiresIn: '24h' }
      );

      console.log('Registration successful for:', email);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      console.log('Login request for:', req.body.email);
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your_secret_key_here_123',
        { expiresIn: '24h' }
      );

      console.log('Login successful for:', email);
      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = authController;