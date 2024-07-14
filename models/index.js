
// initialize Sequelize and define database models

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const CurrencyPair = sequelize.define('CurrencyPair', {
    baseCurrency: {
        type: Sequelize.STRING,
        allowNull: false
    },
    targetCurrency: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

sequelize.authenticate()
.then(() => console.log(`Connection has been established successfully.`))
.catch(err => console.error(`Unable to connect to the database:`, err));

// Synchronize all defined models to the DB.
sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.error('Error creating database & tables:', err));

module.exports = {
    sequelize,
    CurrencyPair
};