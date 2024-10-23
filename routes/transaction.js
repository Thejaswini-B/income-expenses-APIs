const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/', auth, addTransaction);
router.get('/', auth, getTransactions);
router.get('/:id', auth, getTransactionById);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;
