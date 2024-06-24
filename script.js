const cryptoApiKey = 'caef2fba-7a9d-4c15-834a-e3be38796e4e'; // API key dari CoinMarketCap
const stockApiKey = 'cpsi6vhr01qkode1hlagcpsi6vhr01qkode1hlb0'; // API key dari Finhub.io
const stocks = ['AAPL', 'GOOGL']; // Daftar saham yang ingin ditampilkan
const cryptos = ['BTC', 'ETH']; // Daftar cryptocurrency yang ingin ditampilkan

// Fungsi untuk membuat chart
function createChart(ctx, labels, data, title) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price'
                    }
                }
            }
        }
    });
}

// Fungsi untuk mengambil data harga saham dari Finhub.io
async function getStockPrices() {
    const pricesDiv = document.getElementById('prices');
    pricesDiv.innerHTML = ''; // Mengosongkan div sebelum menambahkan data baru

    for (let stock of stocks) {
        try {
            const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${stockApiKey}`);
            const data = await response.json();
            const priceDiv = document.createElement('div');
            priceDiv.className = 'col-md-6 price';
            priceDiv.innerHTML = `
                <h3>${stock}</h3>
                <p>Price: $${data.c}</p>
                <div class="chart-container">
                    <canvas id="chart-${stock}"></canvas>
                </div>
            `;
            pricesDiv.appendChild(priceDiv);

            // Membuat chart
            const ctx = document.getElementById(`chart-${stock}`).getContext('2d');
            const labels = []; // Array untuk label waktu
            const prices = []; // Array untuk harga

            // Update chart setiap 10 detik
            setInterval(async () => {
                const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${stockApiKey}`);
                const newData = await res.json();
                const currentTime = new Date();

                // Tambahkan data baru ke array
                labels.push(currentTime);
                prices.push(newData.c);

                // Batasi jumlah data yang ditampilkan
                if (labels.length > 10) {
                    labels.shift();
                    prices.shift();
                }

                // Perbarui chart
                createChart(ctx, labels, prices, `${stock} Price`);
            }, 10000);
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
            const symbol = crypto.toUpperCase();
            const priceDiv = document.createElement('div');
            priceDiv.className = 'col-md-6 price';
            priceDiv.innerHTML = `
                <h3>${symbol}</h3>
                <p>Price: $${data.data[symbol].quote.USD.price}</p>
                <div class="chart-container">
                    <canvas id="chart-${symbol}"></canvas>
                </div>
            `;
            pricesDiv.appendChild(priceDiv);

            // Membuat chart
            const ctx = document.getElementById(`chart-${symbol}`).getContext('2d');
            const labels = []; // Array untuk label waktu
            const prices = []; // Array untuk harga

            // Update chart setiap 10 detik
            setInterval(async () => {
                const res = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto}`, {
                    headers: {
                        'X-CMC_PRO_API_KEY': cryptoApiKey
                    }
                });
                const newData = await res.json();
                const currentTime = new Date();

                // Tambahkan data baru ke array
                labels.push(currentTime);
                prices.push(newData.data[symbol].quote.USD.price);

                // Batasi jumlah data yang ditampilkan
                if (labels.length > 10) {
                    labels.shift();
                    prices.shift();
                }

                // Perbarui chart
                createChart(ctx, labels, prices, `${symbol} Price`);
            }, 10000);
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
    recommendationDiv.className = 'col-md-6 recommendation';
    recommendationDiv.innerHTML = `<h3>Buy ${Math.random() > 0.5 ? randomStock : randomCrypto}</h3>`;
    recommendationsDiv.appendChild(recommendationDiv);
}

// Panggil fungsi untuk mengambil data dan merekomendasikan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    getStockPrices();
    getCryptoPrices();
    recommend();
});
