const cryptoApiKey = 'caef2fba-7a9d-4c15-834a-e3be38796e4e'; // API key dari CoinMarketCap
const stockApiKey = 'cpsi6vhr01qkode1hlagcpsi6vhr01qkode1hlb0'; // API key dari Finhub.io
const stockExchange = 'IDX'; // Kode untuk Bursa Efek Indonesia

async function getStockPrices() {
    const pricesDiv = document.getElementById('prices');
    pricesDiv.innerHTML = ''; // Mengosongkan div sebelum menambahkan data baru

    try {
        const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=${stockExchange}&token=${stockApiKey}`);
        const stocks = await response.json();

        for (let stock of stocks) {
            const stockSymbol = stock.symbol;
            const stockResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${stockApiKey}`);
            const data = await stockResponse.json();

            const priceDiv = document.createElement('div');
            priceDiv.className = 'col-md-6 price';
            priceDiv.innerHTML = `
                <h3>${stockSymbol}</h3>
                <p>Price: $${data.c}</p>
            `;
            pricesDiv.appendChild(priceDiv);
        }
    } catch (error) {
        console.error('Error fetching stock prices:', error);
    }
}

async function getCryptoPrices() {
    const pricesDiv = document.getElementById('prices');

    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`, {
            headers: {
                'X-CMC_PRO_API_KEY': cryptoApiKey
            }
        });
        const data = await response.json();
        const cryptos = data.data;

        for (let crypto of cryptos) {
            const symbol = crypto.symbol;
            const priceDiv = document.createElement('div');
            priceDiv.className = 'col-md-6 price';
            priceDiv.innerHTML = `
                <h3>${symbol}</h3>
                <p>Price: $${crypto.quote.USD.price}</p>
            `;
            pricesDiv.appendChild(priceDiv);
        }
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getStockPrices();
    getCryptoPrices();
});
