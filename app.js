const express = require('express');
const { sequelize, CurrencyPair } = require('./models'); 

const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000; 

// POST route to create a new favorite currency pair
app.post('/api/favorites', async (req, res) => {
    try {
        const { baseCurrency, targetCurrency } = req.body;
        const pair = await CurrencyPair.create({ baseCurrency, targetCurrency });
        res.status(201).json(pair);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET route to retrieve all favorite currency pairs
app.get('/api/favorites', async (req, res) => {
    try {
        const pairs = await CurrencyPair.findAll();
        res.status(200).json(pairs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync database and start server
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });
