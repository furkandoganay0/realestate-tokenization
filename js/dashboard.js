document.addEventListener('DOMContentLoaded', () => {
    if (!window.userState.isConnected) {
        document.querySelector('.dashboard').innerHTML = `
            <div class="container">
                <div class="not-connected">
                    <h2>Lütfen cüzdanınızı bağlayın</h2>
                    <p>Yatırımlarınızı görüntülemek için cüzdanınızı bağlamanız gerekmektedir.</p>
                    <button onclick="window.connectWallet()" class="btn primary">Cüzdan Bağla</button>
                </div>
            </div>
        `;
        return;
    }

    // Örnek veriler
    const portfolioData = {
        labels: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
        values: [100000, 105000, 108000, 115000, 120000, 125000]
    };

    const incomeData = {
        labels: ['Kira Geliri', 'Değer Artışı'],
        values: [60, 40]
    };

    const properties = [
        {
            id: 1,
            title: 'Modern Daire',
            location: 'Kadıköy, İstanbul',
            image: '../assets/images/modern-apartment.jpg',
            tokens: 250,
            value: '25,000 TL',
            return: '12%'
        },
        {
            id: 2,
            title: 'Ofis Katı',
            location: 'Levent, İstanbul',
            image: '../assets/images/office-space.jpg',
            tokens: 500,
            value: '50,000 TL',
            return: '15%'
        }
    ];

    const transactions = [
        {
            type: 'buy',
            title: 'Token Alımı',
            property: 'Modern Daire',
            date: '15 Haz 2023',
            amount: '+250 Token',
            value: '25,000 TL'
        },
        {
            type: 'income',
            title: 'Kira Geliri',
            property: 'Ofis Katı',
            date: '1 Haz 2023',
            amount: '+1,500 TL',
            value: '1,500 TL'
        }
    ];

    // Portföy değeri hesaplama güncellemesi
    const portfolioValue = window.userState.wallet.tokens.reduce((total, token) => {
        const property = window.properties.find(p => p.id === token.propertyId);
        if (property) {
            return total + (property.price * token.amount);
        }
        return total;
    }, 0);

    // Portföy özeti güncelleme
    document.querySelector('.summary-value').textContent = formatCurrency(portfolioValue);
    document.querySelector('.summary-change').innerHTML = `
        <i class="fas fa-arrow-up"></i> %12.5
    `;
    document.querySelector('.wallet-balance').textContent = formatCurrency(window.userState.wallet.balance);
    
    // Portföy grafiği
    const portfolioChart = new Chart(
        document.getElementById('portfolioChart'),
        {
            type: 'line',
            data: {
                labels: portfolioData.labels,
                datasets: [{
                    label: 'Portföy Değeri',
                    data: portfolioData.values,
                    borderColor: '#2563eb',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );

    // Gelir dağılımı grafiği
    const incomeChart = new Chart(
        document.getElementById('incomeChart'),
        {
            type: 'doughnut',
            data: {
                labels: incomeData.labels,
                datasets: [{
                    data: incomeData.values,
                    backgroundColor: ['#2563eb', '#10B981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    );

    // Gayrimenkul listesini güncelle
    const propertyList = document.querySelector('.property-list');
    propertyList.innerHTML = window.userState.wallet.tokens.map(token => {
        const property = properties.find(p => p.id === token.propertyId);
        return `
            <div class="property-item">
                <img src="${property.image}" alt="${property.title}" class="property-image">
                <div class="property-info">
                    <div class="property-title">${property.title}</div>
                    <div class="property-location">${property.location}</div>
                    <div class="property-stats">
                        <div>${token.amount} Token</div>
                        <div>Değer: ${(property.price * token.amount).toLocaleString()} TL</div>
                        <div>Getiri: ${property.annualReturn}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // İşlem listesini oluştur
    const transactionList = document.querySelector('.transaction-list');
    transactionList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon">
                    <i class="fas fa-${transaction.type === 'buy' ? 'shopping-cart' : 'coins'}"></i>
                </div>
                <div class="transaction-details">
                    <h3>${transaction.title}</h3>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type === 'income' ? 'positive' : ''}">${transaction.amount}</div>
        </div>
    `).join('');
}); 