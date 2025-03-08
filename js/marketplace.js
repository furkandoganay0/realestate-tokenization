// Sayfalama ayarları
const ITEMS_PER_PAGE = 6;
let currentPage = 1;

// Örnek gayrimenkul verileri
const properties = [
    {
        id: 1,
        type: 'Konut',
        title: 'Modern Daire',
        location: 'Kadıköy, İstanbul',
        image: '../assets/images/modern-apartment.jpg', // 3+1 modern daire
        price: 750,
        totalValue: '2,500,000 TL',
        tokenSupply: '25,000',
        annualReturn: '12%'
    },
    {
        id: 2,
        type: 'Ticari',
        title: 'Ofis Katı',
        location: 'Levent, İstanbul',
        image: '../assets/images/office-space.jpg', // Modern ofis katı
        price: 1200,
        totalValue: '5,000,000 TL',
        tokenSupply: '50,000',
        annualReturn: '15%'
    },
    {
        id: 3,
        type: 'Arsa',
        title: 'Yatırımlık Arsa',
        location: 'Çeşme, İzmir',
        image: '../assets/images/land-plot.jpg', // Deniz manzaralı arsa
        price: 500,
        totalValue: '1,500,000 TL',
        tokenSupply: '15,000',
        annualReturn: '10%'
    },
    {
        id: 4,
        type: 'Konut',
        title: 'Lüks Villa',
        location: 'Beykoz, İstanbul',
        image: '../assets/images/luxury-villa.jpg', // Boğaz manzaralı villa
        price: 2000,
        totalValue: '8,000,000 TL',
        tokenSupply: '80,000',
        annualReturn: '18%'
    },
    {
        id: 5,
        type: 'Ticari',
        title: 'AVM Mağazası',
        location: 'Ataşehir, İstanbul',
        image: '../assets/images/retail-store.jpg', // Modern mağaza
        price: 850,
        totalValue: '3,200,000 TL',
        tokenSupply: '32,000',
        annualReturn: '14%'
    },
    {
        id: 6,
        type: 'Konut',
        title: 'Bahçeli Dubleks',
        location: 'Çankaya, Ankara',
        image: '../assets/images/duplex-garden.jpg', // Bahçeli ev
        price: 1500,
        totalValue: '4,500,000 TL',
        tokenSupply: '45,000',
        annualReturn: '13%'
    },
    {
        id: 7,
        type: 'Ticari',
        title: 'Depo & Lojistik Merkezi',
        location: 'Tuzla, İstanbul',
        image: '../assets/images/warehouse.jpg', // Modern depo
        price: 1800,
        totalValue: '6,000,000 TL',
        tokenSupply: '60,000',
        annualReturn: '16%'
    },
    {
        id: 8,
        type: 'Konut',
        title: 'Deniz Manzaralı Residence',
        location: 'Karşıyaka, İzmir',
        image: '../assets/images/seaside-residence.jpg', // Deniz manzaralı daire
        price: 950,
        totalValue: '3,800,000 TL',
        tokenSupply: '38,000',
        annualReturn: '11%'
    }
];

// Gayrimenkul kartlarını oluştur
function createPropertyCard(property) {
    return `
        <div class="property-card">
            <img src="${property.image}" alt="${property.title}" class="property-image">
            <div class="property-details">
                <div class="property-type">${property.type}</div>
                <h3 class="property-title">${property.title}</h3>
                <div class="property-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${property.location}
                </div>
                <div class="property-stats">
                    <div class="stat">
                        <div class="stat-label">Token Fiyatı</div>
                        <div class="stat-value">${property.price} TL</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Toplam Değer</div>
                        <div class="stat-value">${property.totalValue}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Yıllık Getiri</div>
                        <div class="stat-value">${property.annualReturn}</div>
                    </div>
                </div>
            </div>
            <div class="property-footer">
                <div class="token-price">Token Başına: ${property.price} TL</div>
                <button class="invest-button" onclick="startInvestment(${property.id})">Yatırım Yap</button>
            </div>
        </div>
    `;
}

// Sayfa numaralarını oluştur
function createPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';

    // Sayfa numaralarını oluştur
    for (let i = 1; i <= totalPages; i++) {
        const pageNumber = document.createElement('div');
        pageNumber.className = `page-number ${currentPage === i ? 'active' : ''}`;
        pageNumber.textContent = i;
        pageNumber.addEventListener('click', () => goToPage(i));
        pageNumbers.appendChild(pageNumber);
    }

    // Önceki/Sonraki butonlarını güncelle
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Belirli bir sayfaya git
function goToPage(page) {
    currentPage = page;
    renderProperties();
}

// Sayfalama ile birlikte gayrimenkulleri listele
function renderProperties(propertyList = properties) {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = propertyList.slice(startIndex, endIndex);

    const propertiesContainer = document.querySelector('.properties');
    propertiesContainer.innerHTML = paginatedItems
        .map(property => createPropertyCard(property))
        .join('');

    createPagination(propertyList.length, currentPage);
}

// Filtreleme fonksiyonu
function filterProperties() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const propertyType = document.querySelector('#propertyType').value;
    const location = document.querySelector('#location').value;
    const priceRange = document.querySelector('#priceRange').value;

    let filtered = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm) ||
                            property.location.toLowerCase().includes(searchTerm);
        const matchesType = !propertyType || property.type.toLowerCase() === propertyType;
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        
        let matchesPrice = true;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(num => parseInt(num) || Infinity);
            matchesPrice = property.price >= min && property.price <= max;
        }

        return matchesSearch && matchesType && matchesLocation && matchesPrice;
    });

    currentPage = 1; // Filtreleme yapıldığında ilk sayfaya dön
    renderProperties(filtered);
}

// Yatırım başlatma fonksiyonu
function startInvestment(propertyId) {
    if (!window.ethereum) {
        alert('Lütfen MetaMask yükleyin!');
        return;
    }
    
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        // Burada yatırım modalı açılabilir
        alert(`${property.title} için yatırım işlemi başlatılıyor...`);
        // Token satın alma işlemleri buraya eklenecek
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProperties();
    
    // Sayfalama butonları için event listeners
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(properties.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    });

    // Arama ve filtreleme için event listeners
    document.querySelector('.search-box input').addEventListener('input', filterProperties);
    document.querySelector('#propertyType').addEventListener('change', filterProperties);
    document.querySelector('#location').addEventListener('change', filterProperties);
    document.querySelector('#priceRange').addEventListener('change', filterProperties);
}); 