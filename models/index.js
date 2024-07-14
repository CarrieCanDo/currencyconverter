
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

module.exports = {
    sequelize,
    CurrencyPair
};
