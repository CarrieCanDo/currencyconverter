const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const CurrencyPair = sequelize.define('CurrencyPair', {
    baseCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = CurrencyPair;
