const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.get('/', accountController.getUserAccounts);
router.post('/', accountController.createAccount);

module.exports = router;