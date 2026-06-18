// ==========================================================================
// CHARME ACCESSORIES - APPLICATION SCRIPT
// ==========================================================================

// 1. PRODUCT DATABASE (No pricing displayed)
const PRODUCTS = [
    {
        id: 'necklace_gold',
        name: 'Altın Kolye Zincir',
        category: 'necklace',
        description: 'Zarif geometrik tasarımı ve 24 Ayar altın kaplamasıyla her anınıza zarafet katacak özel tasarım zincir kolye. El işçiliği detayları ile göz alıcı bir parlaklığa sahiptir.',
        image: 'assets/images/necklace_gold.png',
        rating: 4.8,
        reviews: 32,
        isNew: true,
        lookbookPos: { backgroundPosition: '50% 62%', backgroundSize: '36%' }
    },
    {
        id: 'ring_emerald',
        name: 'Zümrüt Taşlı Altın Yüzük',
        category: 'ring',
        description: 'Ortasında yer alan göz alıcı kare kesim zümrüt taşı ve etrafını süsleyen küçük pırlanta detaylarıyla şıklığın sembolü. Özel günlerinize eşsiz bir ışıltı katacak.',
        image: 'assets/images/ring_emerald.png',
        rating: 4.9,
        reviews: 18,
        isNew: true,
        lookbookPos: { backgroundPosition: '52% 80%', backgroundSize: '15%' }
    },
    {
        id: 'earrings_pearl',
        name: 'İnci Detaylı Altın Küpe',
        category: 'earrings',
        description: 'Gerçek tatlı su incileriyle el işçiliği olarak tasarlanmış, klasik ve modern detayların harmanlandığı lüks halka küpeler. Günlük ve şık kombinler için mükemmel.',
        image: 'assets/images/earrings_pearl.png',
        rating: 4.7,
        reviews: 24,
        isNew: false,
        lookbookPos: { backgroundPosition: '49% 46%', backgroundSize: '24%' }
    },
    {
        id: 'bracelet_gold',
        name: 'Geometrik Altın Bilezik',
        category: 'bracelet',
        description: 'Üzerindeki özel geometrik motifler ve kalın yapısı ile stilinizde iddialı ve şık bir görünüm sunan lüks bilezik. Dayanıklı kilit sistemiyle güvenli kullanım.',
        image: 'assets/images/bracelet_gold.png',
        rating: 4.6,
        reviews: 15,
        isNew: false,
        lookbookPos: { backgroundPosition: '68% 75%', backgroundSize: '18%' }
    },
    {
        id: 'ring_silver',
        name: 'Gümüş Minimalist Yüzük',
        category: 'ring',
        description: '925 Ayar gümüşten imal edilmiş, sade ve asil duruşuyla günlük kullanıma son derece uygun minimalist tasarım yüzük.',
        image: 'assets/images/ring_emerald.png', // Fallback image for demonstrative rendering
        rating: 4.5,
        reviews: 29,
        isNew: false,
        lookbookPos: { backgroundPosition: '52% 80%', backgroundSize: '14%' }
    },
    {
        id: 'necklace_silver',
        name: 'Gümüş Gerdanlık Kolye',
        category: 'necklace',
        description: '925 Ayar gümüş zemin üzerine yerleştirilmiş özel kristal taşları ile göz kamaştıran ve boynunuzda asil bir görünüm sunan gerdanlık.',
        image: 'assets/images/necklace_gold.png', // Fallback image
        rating: 4.8,
        reviews: 12,
        isNew: true,
        lookbookPos: { backgroundPosition: '50% 62%', backgroundSize: '36%' }
    }
];

// 2. STATE MANAGEMENT
let currentLookbook = {
    necklace: null,
    earrings: null,
    bracelet: null,
    ring: null
};
let activeFilters = {
    category: 'all',
    search: '',
    sort: 'default'
};
let selectedProductForModal = null;

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeaderScroll();
    initMobileMenu();
    initFilters();
    initLookbookTabs();
    initModalEvents();
    
    // Initial Render
    renderCatalog();
    renderWardrobe('necklace'); // Default lookbook tab
});

// 4. CUSTOM CURSOR LOGIC
function initCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('customCursorGlow');
    
    if (!cursor || !cursorGlow) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Smooth glow motion
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // Event delegation for interactive elements hover styling
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, select, input, textarea, .product-card, .wardrobe-card, .qty-btn')) {
            document.body.classList.add('hover-interactive');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.target.closest('a, button, select, input, textarea, .product-card, .wardrobe-card, .qty-btn')) {
            document.body.classList.remove('hover-interactive');
        }
    });
}

// 5. HEADER & MOBILE MENU LOGIC
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close when link clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// 6. FILTERS & SEARCH SYSTEM
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    // Category Filter Buttons
    document.querySelectorAll('[id^="filterCat"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[id^="filterCat"]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilters.category = btn.getAttribute('data-category');
            renderCatalog();
        });
    });

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.trim().toLowerCase();
            renderCatalog();
        });
    }

    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            activeFilters.sort = e.target.value;
            renderCatalog();
        });
    }
}

// 7. CATALOG RENDER LOGIC
function renderCatalog() {
    const productGrid = document.getElementById('productGrid');
    const noProductsMsg = document.getElementById('noProductsMsg');
    
    if (!productGrid) return;

    // Filter Products
    let filtered = PRODUCTS.filter(product => {
        const matchesCategory = activeFilters.category === 'all' || product.category === activeFilters.category;
        const matchesSearch = product.name.toLowerCase().includes(activeFilters.search) || 
                              product.description.toLowerCase().includes(activeFilters.search);
        return matchesCategory && matchesSearch;
    });

    // Sort Products
    if (activeFilters.sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    // Render Grid
    productGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        noProductsMsg.style.display = 'block';
        productGrid.style.display = 'none';
        return;
    }

    noProductsMsg.style.display = 'none';
    productGrid.style.display = 'grid';

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card animate-fade-in';
        card.innerHTML = `
            <div class="product-img-wrapper" onclick="openProductModal('${product.id}')">
                ${product.isNew ? '<span class="product-badge">Yeni</span>' : ''}
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <button class="product-quickview-btn">Showroom İncele</button>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryNameTr(product.category)}</div>
                <h3 class="product-title" onclick="openProductModal('${product.id}')">${product.name}</h3>
                <div class="product-rating">
                    ${getStarsSVG(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-bottom" style="justify-content: center; padding-top: 0.8rem;">
                    <button class="btn btn-secondary btn-sm btn-block" onclick="openProductModal('${product.id}')">İncele / Randevu Al</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Helper Translation Names
function getCategoryNameTr(cat) {
    const names = {
        'necklace': 'Kolye',
        'ring': 'Yüzük',
        'earrings': 'Küpe',
        'bracelet': 'Bilezik'
    };
    return names[cat] || cat;
}

function getStarsSVG(rating) {
    let stars = '';
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
        if (i <= rounded) {
            stars += `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
        } else {
            stars += `<svg viewBox="0 0 24 24" style="fill:rgba(255,255,255,0.15);"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03z"/></svg>`;
        }
    }
    return stars;
}

// 8. LOOKBOOK & TRY-ON CANVAS SYSTEM
function initLookbookTabs() {
    const tabBtns = document.querySelectorAll('.wardrobe-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            
            // Map tab name to category
            let cat = 'necklace';
            if (tabName === 'earrings') cat = 'earrings';
            if (tabName === 'bracelets') cat = 'bracelet';
            
            renderWardrobe(cat);
        });
    });

    const resetBtn = document.getElementById('resetLookbookBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetLookbook);
    }

    const addLookbookCartBtn = document.getElementById('addLookbookToCartBtn');
    if (addLookbookCartBtn) {
        addLookbookCartBtn.addEventListener('click', addLookbookToInquiry);
    }
}

function renderWardrobe(category) {
    const wardrobeGrid = document.getElementById('wardrobeGrid');
    if (!wardrobeGrid) return;

    const categoriesToDisplay = category === 'bracelet' ? ['bracelet', 'ring'] : [category];
    const items = PRODUCTS.filter(p => categoriesToDisplay.includes(p.category));

    wardrobeGrid.innerHTML = '';
    items.forEach(item => {
        const isApplied = currentLookbook[item.category] && currentLookbook[item.category].id === item.id;
        const card = document.createElement('div');
        card.className = `wardrobe-card ${isApplied ? 'applied' : ''}`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="wardrobe-card-img">
            <h4 class="wardrobe-card-title" style="margin-bottom:0;">${item.name}</h4>
        `;
        card.addEventListener('click', () => toggleLookbookItem(item));
        wardrobeGrid.appendChild(card);
    });
}

function toggleLookbookItem(item) {
    const category = item.category;
    
    if (currentLookbook[category] && currentLookbook[category].id === item.id) {
        currentLookbook[category] = null;
    } else {
        currentLookbook[category] = item;
    }

    updateLookbookUI();
}

function updateLookbookUI() {
    const layers = {
        necklace: document.getElementById('overlayNecklace'),
        earrings: document.getElementById('overlayEarrings'),
        bracelet: document.getElementById('overlayBracelet'),
        ring: document.getElementById('overlayRing')
    };

    const activeTabBtn = document.querySelector('.wardrobe-tab-btn.active');
    if (activeTabBtn) {
        const tabName = activeTabBtn.getAttribute('data-tab');
        let cat = 'necklace';
        if (tabName === 'earrings') cat = 'earrings';
        if (tabName === 'bracelets') cat = 'bracelet';
        renderWardrobe(cat);
    }

    Object.keys(layers).forEach(cat => {
        const layer = layers[cat];
        const item = currentLookbook[cat];
        if (layer) {
            if (item) {
                layer.style.backgroundImage = `url('${item.image}')`;
                if (item.lookbookPos) {
                    layer.style.backgroundPosition = item.lookbookPos.backgroundPosition;
                    layer.style.backgroundSize = item.lookbookPos.backgroundSize;
                }
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
                layer.style.backgroundImage = '';
            }
        }
    });

    const summaryList = document.getElementById('lookbookSummaryList');
    const emptyMsg = document.getElementById('lookbookEmptyMsg');

    if (!summaryList) return;

    summaryList.innerHTML = '';
    let hasItems = false;

    Object.keys(currentLookbook).forEach(cat => {
        const item = currentLookbook[cat];
        if (item) {
            hasItems = true;
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item animate-fade-in';
            summaryItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="summary-item-img">
                <div class="summary-item-info">
                    <span class="summary-item-title">${item.name}</span>
                </div>
                <button class="summary-item-remove" onclick="removeSingleLookbook('${cat}')">&times;</button>
            `;
            summaryList.appendChild(summaryItem);
        }
    });

    if (hasItems) {
        emptyMsg.style.display = 'none';
    } else {
        summaryList.appendChild(emptyMsg);
        emptyMsg.style.display = 'block';
    }
}

window.removeSingleLookbook = function(category) {
    currentLookbook[category] = null;
    updateLookbookUI();
};

function resetLookbook() {
    currentLookbook = {
        necklace: null,
        earrings: null,
        bracelet: null,
        ring: null
    };
    updateLookbookUI();
}

function addLookbookToInquiry() {
    let itemsSelected = [];
    Object.keys(currentLookbook).forEach(cat => {
        const item = currentLookbook[cat];
        if (item) {
            itemsSelected.push(item.name);
        }
    });

    if (itemsSelected.length > 0) {
        const msgInput = document.getElementById('formMsg');
        if (msgInput) {
            msgInput.value = `Merhaba, sanal stilist üzerinde kombinlediğim şu aksesuarları Kızılay showroomunuzda yakından incelemek için randevu oluşturmak istiyorum:\n- ${itemsSelected.join('\n- ')}`;
        }
        
        // Scroll smoothly to contact form
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        showToast('Kombininiz randevu formuna eklendi.');
    } else {
        showToast('Lütfen önce kombinlemek için en az bir ürün seçin.');
    }
}

// 9. PRODUCT DETAIL MODAL LOGIC
function initModalEvents() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const modalAddCartBtn = document.getElementById('modalAddToCartBtn');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeProductModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProductModal();
        });
    }

    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
            if (selectedProductForModal) {
                const msgInput = document.getElementById('formMsg');
                if (msgInput) {
                    msgInput.value = `Merhaba, "${selectedProductForModal.name}" aksesuarı hakkında bilgi almak ve Ankara Kızılay showroomunuzda incelemek için randevu oluşturmak istiyorum.`;
                }
                closeProductModal();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                showToast('Ürün detayları randevu formuna aktarıldı.');
            }
        });
    }
}

window.openProductModal = function(productId) {
    const modal = document.getElementById('productModal');
    const product = PRODUCTS.find(p => p.id === productId);
    
    if (!modal || !product) return;

    selectedProductForModal = product;

    // Fill elements
    document.getElementById('modalMainImg').src = product.image;
    document.getElementById('modalMainImg').alt = product.name;
    document.getElementById('modalCategory').innerText = getCategoryNameTr(product.category);
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalDesc').innerText = product.description;
    document.getElementById('modalReviewsCount').innerText = `(${product.reviews} Müşteri Yorumu)`;
    
    // Rating Stars
    document.getElementById('modalStars').innerHTML = getStarsSVG(product.rating);

    modal.classList.add('open');
};

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('open');
        selectedProductForModal = null;
    }
}

// 10. TOAST NOTIFICATION
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMsg');
    
    if (!toast || !toastMsg) return;

    toastMsg.innerText = message;
    toast.classList.add('show');

    // Auto clear
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
