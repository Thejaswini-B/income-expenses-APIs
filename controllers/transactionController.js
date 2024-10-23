const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

exports.addTransaction = async (req, res) => {
    try {
        const { type, category, amount, description } = req.body;
        const newTransaction = new Transaction({
            type,
            category,
            amount,
            description,
            userId: req.user.id
        });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Pagination
    try {
        const transactions = await Transaction.find({ userId: req.user.id })
            .populate('category')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Transaction.countDocuments({ userId: req.user.id });
        res.json({
            transactions,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.userId.toString() !== req.user.id) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { type, category, amount, description } = req.body;
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { type, category, amount, description },
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(updatedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(deletedTransaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
