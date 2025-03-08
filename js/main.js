// Kullanıcı durumu
let userState = {
    isConnected: false,
    wallet: {
        address: null,
        balance: 0, // TL cinsinden bakiye
        tokens: [] // Kullanıcının sahip olduğu tokenler
    }
};

// Demo cüzdan adresi oluştur
function generateWalletAddress() {
    return '0x' + Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

// Cüzdan bağlantı işlemleri
function connectWallet() {
    if (!userState.isConnected) {
        userState.isConnected = true;
        userState.wallet.address = generateWalletAddress();
        userState.wallet.balance = 50000; // Demo için 50,000 TL başlangıç bakiyesi
        updateWalletUI();
        
        // Bağlantı durumunu localStorage'a kaydet
        localStorage.setItem('walletState', JSON.stringify(userState));

        // Bağlantı başarılı bildirimi
        alert(
            `Cüzdan Bağlandı!\n\n` +
            `Adres: ${userState.wallet.address}\n` +
            `Bakiye: ${formatCurrency(userState.wallet.balance)}\n\n` +
            `Demo hesabınıza ${formatCurrency(userState.wallet.balance)} yüklendi.`
        );

        // Dashboard sayfasındaysa yenile
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.reload();
        }
    }
}

// Cüzdan UI'ını güncelle
function updateWalletUI() {
    const connectButton = document.querySelector('.connect-wallet');
    
    if (userState.isConnected) {
        const shortAddress = `${userState.wallet.address.slice(0, 6)}...${userState.wallet.address.slice(-4)}`;
        connectButton.innerHTML = `
            <i class="fas fa-wallet"></i>
            ${shortAddress} (${formatCurrency(userState.wallet.balance)})
        `;
        connectButton.classList.add('connected');
    } else {
        connectButton.innerHTML = 'Cüzdan Bağla';
        connectButton.classList.remove('connected');
    }
}

// Token satın alma işlemi
function buyTokens(propertyId, amount) {
    if (!userState.isConnected) {
        alert('Lütfen önce cüzdanınızı bağlayın!');
        return false;
    }

    const property = window.properties.find(p => p.id === propertyId);
    if (!property) return false;

    const totalCost = property.price * amount;
    
    if (userState.wallet.balance < totalCost) {
        alert(`Yetersiz bakiye! Gerekli tutar: ${formatCurrency(totalCost)}\nMevcut bakiye: ${formatCurrency(userState.wallet.balance)}`);
        return false;
    }

    // İşlem onayı
    const confirmed = confirm(
        `Satın Alma Detayları:\n\n` +
        `Gayrimenkul: ${property.title}\n` +
        `Token Adedi: ${amount}\n` +
        `Birim Fiyat: ${formatCurrency(property.price)}\n` +
        `Toplam Tutar: ${formatCurrency(totalCost)}\n\n` +
        `Onaylıyor musunuz?`
    );

    if (!confirmed) return false;

    // Satın alma işlemini gerçekleştir
    userState.wallet.balance -= totalCost;
    
    // Token'ı kullanıcının portföyüne ekle
    const existingToken = userState.wallet.tokens.find(t => t.propertyId === propertyId);
    if (existingToken) {
        existingToken.amount += amount;
    } else {
        userState.wallet.tokens.push({
            propertyId: propertyId,
            propertyTitle: property.title,
            amount: amount,
            purchasePrice: property.price,
            purchaseDate: new Date().toISOString()
        });
    }

    // Durumu kaydet
    localStorage.setItem('walletState', JSON.stringify(userState));
    
    // Başarılı işlem bildirimi
    alert(
        `İşlem Başarılı!\n\n` +
        `${amount} adet ${property.title} tokeni satın alındı.\n` +
        `Kalan bakiye: ${formatCurrency(userState.wallet.balance)}`
    );

    // Dashboard sayfasındaysa yenile
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.reload();
    }

    return true;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // LocalStorage'dan kullanıcı durumunu yükle
    const savedState = localStorage.getItem('walletState');
    if (savedState) {
        userState = JSON.parse(savedState);
    }

    // Cüzdan bağlantı butonunu ayarla
    const connectButton = document.querySelector('.connect-wallet');
    connectButton.addEventListener('click', connectWallet);

    // UI'ı güncelle
    updateWalletUI();
});

// Dışa aktar
window.userState = userState;
window.buyTokens = buyTokens;
window.connectWallet = connectWallet;

// Sayfa yüklendiğinde animasyonları başlat
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Feature kartları için basit bir fade-in animasyonu
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// Smooth scroll için yardımcı fonksiyon
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mevcut fonksiyonlara ek olarak:
function formatCurrency(amount) {
    return amount.toLocaleString('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    });
} 