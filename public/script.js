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
        fetch(`${API_URL}/currencies?apikey=${API_KEY}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched currencies:', data);
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
        fetch(`${API_URL}/latest?apikey=${API_KEY}&base_currency=${baseCurrency}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched exchange rates:', data);
                updateConvertedAmount(data.data);
            })
            .catch(error => {
                console.error('Error fetching exchange rates:', error);
                convertedAmountDisplay.textContent = 'Error fetching data';
            });
    }

    // Update converted amount
    function updateConvertedAmount(rates) {
        const amount = parseFloat(amountInput.value);
        const rate = rates[targetCurrencySelect.value];
        console.log('Rates:', rates);
        console.log('Selected target currency rate:', rate);
        if (isNaN(amount) || amount <= 0) {
            convertedAmountDisplay.textContent = 'Enter a valid amount';
            return;
        }
        if (rate) {
            const convertedAmount = amount * rate;
            convertedAmountDisplay.textContent = convertedAmount.toFixed(2);
        } else {
            convertedAmountDisplay.textContent = 'Rate not available';
        }
    }

 // Fetch historical rates
function fetchHistoricalRates(baseCurrency, targetCurrency, date) {
    const API_KEY = "fca_live_dWPx35fk2g6THo7VvSgrbBvTmCWSzxUg93C5hN2p";
    const API_URL = "https://api.freecurrencyapi.com/v1";

    const url = `${API_URL}/historical?apikey=${API_KEY}&base_currency=${baseCurrency}&date=${date}&currencies=${targetCurrency}`;
    console.log('Fetching historical rates with URL:', url);
    
    fetch(url, {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Historical rates data:', data);
        displayHistoricalRates(data.data, date);
    })
    .catch(error => {
        console.error('Error fetching historical rates:', error);
        historicalRatesContainer.textContent = 'Error fetching historical rates';
    });
}
})

// Save favorite pair
function saveFavoritePair() {
    const baseCurrency = baseCurrencySelect.value;
    const targetCurrency = targetCurrencySelect.value;
    const pair = { baseCurrency, targetCurrency };

    fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pair)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Saved favorite pair:', data);
        displayFavoritePairs();
    })
    .catch(error => console.error('Error saving favorite pair:', error));
}

// Display favorite pairs
function displayFavoritePairs() {
    favoritePairsContainer.innerHTML = '';
    fetch('/api/favorites')
    .then(response => response.json())
    .then(pairs => {
        pairs.forEach(pair => {
            const button = document.createElement('button');
            button.textContent = `${pair.baseCurrency}/${pair.targetCurrency}`;
            button.addEventListener('click', () => {
                baseCurrencySelect.value = pair.baseCurrency;
                targetCurrencySelect.value = pair.targetCurrency;
                fetchExchangeRates(pair.baseCurrency);
            });
            favoritePairsContainer.appendChild(button);
        });
    })
    .catch(error => console.error('Error fetching favorite pairs:', error));
}

// Initialize
fetchCurrencies();
displayFavoritePairs();

