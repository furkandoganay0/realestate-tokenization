// Cüzdan Bağlantısı
document.querySelector('.connect-wallet').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // MetaMask bağlantı isteği
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            // Cüzdan bağlandığında buton metnini güncelle
            const connectButton = document.querySelector('.connect-wallet');
            connectButton.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
            
            // Başarılı bağlantı bildirimi
            alert('Cüzdan başarıyla bağlandı!');
        } catch (error) {
            console.error('Cüzdan bağlantı hatası:', error);
            alert('Cüzdan bağlantısında bir hata oluştu.');
        }
    } else {
        alert('Lütfen MetaMask yükleyin!');
        window.open('https://metamask.io', '_blank');
    }
});

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