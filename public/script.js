document.addEventListener("DOMContentLoaded", function () {
    const baseCurrencySelect = document.getElementById('base-currency');
    const targetCurrencySelect = document.getElementById('target-currency');
    const amountInput = document.getElementById('amount');
    const convertedAmountDisplay = document.getElementById('converted-amount');
    const historicalRatesBtn = document.getElementById('historical-rates');
    const historicalRatesContainer = document.getElementById('historical-rates-container');
    const saveFavoriteBtn = document.getElementById('save-favorite');
    const favoritePairsContainer = document.getElementById('favorite-currency-pairs');

    const API_KEY = "fca_live_dWPx35fk2g6THo7VvSgrbBvTmCWSzxUg93C5hN2p"; 
    const API_URL = "https://api.freecurrencyapi.com/v1";

    // Fetch available currencies
    function fetchCurrencies() {
        fetch(`${API_URL}/currencies`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                populateCurrencySelects(data.data);
            })
            .catch(error => console.error('Error fetching currencies:', error));
    }

    // Populate currency dropdowns
    function populateCurrencySelects(currencies) {
        for (let currency in currencies) {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            baseCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            targetCurrencySelect.appendChild(option2);
        }
    }

    // Fetch exchange rates
    function fetchExchangeRates(baseCurrency) {
        fetch(`${API_URL}/latest?base_currency=${baseCurrency}&currencies=EUR,USD,CAD`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                updateConvertedAmount(data.data);
            })
            .catch(error => console.error('Error fetching exchange rates:', error));
    }

    // Update converted amount
    function updateConvertedAmount(rates) {
        const amount = parseFloat(amountInput.value);
        const rate = rates[targetCurrencySelect.value];
        const convertedAmount = amount * rate;
        convertedAmountDisplay.textContent = convertedAmount.toFixed(2);
    }

    // Fetch historical rates
    function fetchHistoricalRates(baseCurrency, targetCurrency, date) {
        fetch(`${API_URL}/historical?base_currency=${baseCurrency}&date=${date}&currencies=${targetCurrency}`, {
            method: 'GET',
            headers: {
                'apikey': API_KEY
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                displayHistoricalRates(data.data, date);
            })
            .catch(error => console.error('Error fetching historical rates:', error));
    }

    // Display historical rates
    function displayHistoricalRates(rates, date) {
        const rate = rates[targetCurrencySelect.value];
        historicalRatesContainer.textContent = `Historical exchange rate on ${date}: 1 ${baseCurrencySelect.value} = ${rate} ${targetCurrencySelect.value}`;
    }

    // Save favorite pair
    function saveFavoritePair() {
        const baseCurrency = baseCurrencySelect.value;
        const targetCurrency = targetCurrencySelect.value;
        const pair = `${baseCurrency}/${targetCurrency}`;
        
        // Here, use local storage to save the pairs
        let favorites = JSON.parse(localStorage.getItem('favoritePairs')) || [];
        if (!favorites.includes(pair)) {
            favorites.push(pair);
            localStorage.setItem('favoritePairs', JSON.stringify(favorites));
        }
        displayFavoritePairs();
    }

    // Display favorite pairs
    function displayFavoritePairs() {
        favoritePairsContainer.innerHTML = '';
        const favorites = JSON.parse(localStorage.getItem('favoritePairs')) || [];
        favorites.forEach(pair => {
            const button = document.createElement('button');
            button.textContent = pair;
            button.addEventListener('click', () => {
                const [base, target] = pair.split('/');
                baseCurrencySelect.value = base;
                targetCurrencySelect.value = target;
                fetchExchangeRates(base);
            });
            favoritePairsContainer.appendChild(button);
        });
    }

    // Event listeners
    baseCurrencySelect.addEventListener('change', () => fetchExchangeRates(baseCurrencySelect.value));
    targetCurrencySelect.addEventListener('change', () => fetchExchangeRates(baseCurrencySelect.value));
    amountInput.addEventListener('input', () => fetchExchangeRates(baseCurrencySelect.value));
    historicalRatesBtn.addEventListener('click', () => {
        const date = prompt('Enter a date (YYYY-MM-DD):', '2021-01-01');
        if (date) {
            fetchHistoricalRates(baseCurrencySelect.value, targetCurrencySelect.value, date);
        }
    });
    saveFavoriteBtn.addEventListener('click', saveFavoritePair);

    // Initialize
    fetchCurrencies();
    displayFavoritePairs();
});
