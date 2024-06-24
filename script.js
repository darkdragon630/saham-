const cryptoApiKey = 'caef2fba-7a9d-4c15-834a-e3be38796e4e'; // API key dari CoinMarketCap
const stockApiKey = 'cpsi6vhr01qkode1hlagcpsi6vhr01qkode1hlb0'; // API key dari Finhub.io
const stocks = ['AAPL', 'GOOGL']; // Daftar saham yang ingin ditampilkan
const cryptos = ['bitcoin', 'ethereum']; // Daftar cryptocurrency yang ingin ditampilkan

// Fungsi untuk mengambil data harga saham dari Finhub.io
async function getStockPrices() {
    const pricesDiv = document.getElementById('prices');
    pricesDiv.innerHTML = ''; // Mengosongkan div sebelum menambahkan data baru

    for (let stock of stocks) {
        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${stockApiKey}`);
            const data = await response.json();
            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';
            priceDiv.innerHTML = `<h3>${stock}</h3><p>$${data.c}</p>`; // 'c' adalah harga terkini dalam respons API Finhub
            pricesDiv.appendChild(priceDiv);
        } catch (error) {
            console.error('Error fetching stock prices:', error);
        }
    }
}

// Fungsi untuk mengambil data harga cryptocurrency dari CoinMarketCap
async function getCryptoPrices() {
    const pricesDiv = document.getElementById('prices');

    for (let crypto of cryptos) {
        try {
            const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto}`, {
                headers: {
                    'X-CMC_PRO_API_KEY': cryptoApiKey
                }
            });
            const data = await response.json();
            const priceDiv = document.createElement('div');
            priceDiv.className = 'price';
            const symbol = crypto.toUpperCase();
            priceDiv.innerHTML = `<h3>${symbol}</h3><p>$${data.data[symbol].quote.USD.price}</p>`;
            pricesDiv.appendChild(priceDiv);
        } catch (error) {
            console.error('Error fetching crypto prices:', error);
        }
    }
}

// Fungsi untuk merekomendasikan saham atau cryptocurrency
function recommend() {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = ''; // Mengosongkan div sebelum menambahkan rekomendasi baru

    // Logika sederhana untuk rekomendasi
    const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
    const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)].toUpperCase();

    const recommendationDiv = document.createElement('div');
    recommendationDiv.className = 'recommendation';
    recommendationDiv.innerHTML = `<h3>Buy ${Math.random() > 0.5 ? randomStock : randomCrypto}</h3>`;
    recommendationsDiv.appendChild(recommendationDiv);
}

// Panggil fungsi untuk mengambil data dan merekomendasikan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    getStockPrices();
    getCryptoPrices();
    recommend();
});
