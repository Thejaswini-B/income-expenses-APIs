const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res) => {
    const { startDate, endDate, category } = req.query;
    const filter = { userId: req.user.id };

    if (startDate && endDate) {
        filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (category) {
        filter.category = category;
    }

    try {
        const transactions = await Transaction.find(filter);
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = totalIncome - totalExpenses;

        res.json({ totalIncome, totalExpenses, balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
