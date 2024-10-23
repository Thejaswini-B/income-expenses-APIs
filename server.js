const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

const transactionsRoute = require('./routes/transactions');
const summaryRoute = require('./routes/summary');
const usersRoute = require('./routes/users');

app.use('/transactions', transactionsRoute);
app.use('/summary', summaryRoute);
app.use('/users', usersRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
