// ==========================================================================
// CHARME ACCESSORIES - APPLICATION SCRIPT
// ==========================================================================

// 1. PRODUCT DATABASE
const PRODUCTS = [
    {
        id: 'necklace_gold',
        name: 'Altın Kolye Zincir',
        category: 'necklace',
        material: 'gold',
        price: 1250.00,
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
        material: 'gold',
        price: 2400.00,
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
        material: 'pearl',
        price: 980.00,
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
        material: 'gold',
        price: 1650.00,
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
        material: 'silver',
        price: 750.00,
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
        material: 'silver',
        price: 1380.00,
        description: '925 Ayar gümüş zemin üzerine yerleştirilmiş özel kristal taşları ile göz kamaştıran ve boynunuzda asil bir görünüm sunan gerdanlık.',
        image: 'assets/images/necklace_gold.png', // Fallback image
        rating: 4.8,
        reviews: 12,
        isNew: true,
        lookbookPos: { backgroundPosition: '50% 62%', backgroundSize: '36%' }
    }
];

// 2. STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('charme_cart')) || [];
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
    initCartDrawer();
    initModalEvents();
    
    // Initial Render
    renderCatalog();
    renderWardrobe('necklace'); // Default lookbook tab
    updateCartCount();
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

    let filtered = PRODUCTS.filter(product => {
        const matchesCategory = activeFilters.category === 'all' || product.category === activeFilters.category;
        const matchesSearch = product.name.toLowerCase().includes(activeFilters.search) || 
                              product.description.toLowerCase().includes(activeFilters.search);
        return matchesCategory && matchesSearch;
    });

    // Sort Products
    if (activeFilters.sort === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (activeFilters.sort === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (activeFilters.sort === 'rating') {
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
                <button class="product-quickview-btn">Hızlı İncele</button>
            </div>
            <div class="product-info">
                <div class="product-category">${getCategoryNameTr(product.category)}</div>
                <h3 class="product-title" onclick="openProductModal('${product.id}')">${product.name}</h3>
                <div class="product-rating">
                    ${getStarsSVG(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="product-add-cart" aria-label="Sepete Ekle" onclick="handleAddToCartClick('${product.id}')">
                        <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor;"><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4.5l-3.86 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z"/></svg>
                    </button>
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

function formatPrice(price) {
    return price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
}

// 8. SHOPPING CART MANAGEMENT
function initCartDrawer() {
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const cartDrawerCloseBtn = document.getElementById('cartDrawerCloseBtn');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', openCart);
    }
    if (cartDrawerCloseBtn) {
        cartDrawerCloseBtn.addEventListener('click', closeCart);
    }
    if (cartDrawerOverlay) {
        // Close if click outside cart-drawer content
        cartDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === cartDrawerOverlay) closeCart();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

function openCart() {
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawerOverlay) {
        cartDrawerOverlay.classList.add('open');
        renderCart();
    }
}

function closeCart() {
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    if (cartDrawerOverlay) {
        cartDrawerOverlay.classList.remove('open');
    }
}

function handleAddToCartClick(productId) {
    addToCart(productId, 1);
    openCart();
}

function addToCart(productId, quantity = 1, specOptions = {}) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += parseInt(quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: parseInt(quantity)
        });
    }

    saveCart();
    updateCartCount();
    showToast(`${product.name} sepete eklendi.`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

function updateCartQuantity(productId, change) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartCount();
        renderCart();
    }
}

function saveCart() {
    localStorage.setItem('charme_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartBadge = document.getElementById('cartBadge');
    const cartDrawerCount = document.getElementById('cartDrawerCount');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartBadge) cartBadge.innerText = count;
    if (cartDrawerCount) cartDrawerCount.innerText = count;
}

function renderCart() {
    const cartItemsWrapper = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');

    if (!cartItemsWrapper) return;

    if (cart.length === 0) {
        cartItemsWrapper.innerHTML = `
            <div style="text-align:center; margin: auto 0; color:var(--color-text-muted);">
                <p>Sepetiniz boş.</p>
                <a href="#catalog" onclick="closeCart()" class="btn btn-secondary btn-sm" style="margin-top: 1.5rem;">Alışverişe Başla</a>
            </div>
        `;
        subtotalEl.innerText = '0.00 TL';
        totalEl.innerText = '0.00 TL';
        return;
    }

    cartItemsWrapper.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-img-wrapper">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            </div>
            <div class="cart-item-details">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-meta">Kategori: ${getCategoryNameTr(item.category)}</span>
                <div class="cart-item-qty-row">
                    <button class="cart-qty-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price-side">
                <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Kaldır</button>
            </div>
        `;
        cartItemsWrapper.appendChild(itemEl);
    });

    subtotalEl.innerText = formatPrice(subtotal);
    totalEl.innerText = formatPrice(subtotal);
}

function handleCheckout() {
    if (cart.length === 0) {
        showToast('Sepetiniz boş.');
        return;
    }
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
    
    // Show beautiful success notification
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.innerText = 'Siparişiniz başarıyla alındı! Teşekkür ederiz.';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }
}

// 9. LOOKBOOK & TRY-ON CANVAS SYSTEM
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
            if (tabName === 'bracelets') cat = 'bracelet'; // Display bracelet & rings under bracelets
            
            renderWardrobe(cat);
        });
    });

    const resetBtn = document.getElementById('resetLookbookBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetLookbook);
    }

    const addLookbookCartBtn = document.getElementById('addLookbookToCartBtn');
    if (addLookbookCartBtn) {
        addLookbookCartBtn.addEventListener('click', addLookbookToCart);
    }
}

function renderWardrobe(category) {
    const wardrobeGrid = document.getElementById('wardrobeGrid');
    if (!wardrobeGrid) return;

    // Filter items. If bracelets, display bracelet and ring categories
    const categoriesToDisplay = category === 'bracelet' ? ['bracelet', 'ring'] : [category];
    const items = PRODUCTS.filter(p => categoriesToDisplay.includes(p.category));

    wardrobeGrid.innerHTML = '';
    items.forEach(item => {
        const isApplied = currentLookbook[item.category] && currentLookbook[item.category].id === item.id;
        const card = document.createElement('div');
        card.className = `wardrobe-card ${isApplied ? 'applied' : ''}`;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="wardrobe-card-img">
            <h4 class="wardrobe-card-title">${item.name}</h4>
            <div class="wardrobe-card-price">${formatPrice(item.price)}</div>
        `;
        card.addEventListener('click', () => toggleLookbookItem(item));
        wardrobeGrid.appendChild(card);
    });
}

function toggleLookbookItem(item) {
    const category = item.category;
    
    // Toggle application
    if (currentLookbook[category] && currentLookbook[category].id === item.id) {
        currentLookbook[category] = null;
    } else {
        currentLookbook[category] = item;
    }

    updateLookbookUI();
}

function updateLookbookUI() {
    // 1. Update Overlay Canvas Layers
    const layers = {
        necklace: document.getElementById('overlayNecklace'),
        earrings: document.getElementById('overlayEarrings'),
        bracelet: document.getElementById('overlayBracelet'),
        ring: document.getElementById('overlayRing')
    };

    // Update wardrobe layout applied styles
    const activeTabBtn = document.querySelector('.wardrobe-tab-btn.active');
    if (activeTabBtn) {
        const tabName = activeTabBtn.getAttribute('data-tab');
        let cat = 'necklace';
        if (tabName === 'earrings') cat = 'earrings';
        if (tabName === 'bracelets') cat = 'bracelet';
        renderWardrobe(cat);
    }

    // Render Canvas Layers & Align Coordinates dynamically
    Object.keys(layers).forEach(cat => {
        const layer = layers[cat];
        const item = currentLookbook[cat];
        if (layer) {
            if (item) {
                layer.style.backgroundImage = `url('${item.image}')`;
                
                // Set precise coordinate alignments
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

    // 2. Render Lookbook Summary Details
    const summaryList = document.getElementById('lookbookSummaryList');
    const summaryTotal = document.getElementById('lookbookSummaryTotal');
    const totalPriceEl = document.getElementById('lookbookTotalPrice');
    const emptyMsg = document.getElementById('lookbookEmptyMsg');

    if (!summaryList) return;

    summaryList.innerHTML = '';
    let hasItems = false;
    let total = 0;

    Object.keys(currentLookbook).forEach(cat => {
        const item = currentLookbook[cat];
        if (item) {
            hasItems = true;
            total += item.price;
            
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item animate-fade-in';
            summaryItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="summary-item-img">
                <div class="summary-item-info">
                    <span class="summary-item-title">${item.name}</span>
                    <span class="summary-item-price">${formatPrice(item.price)}</span>
                </div>
                <button class="summary-item-remove" onclick="removeSingleLookbook('${cat}')">&times;</button>
            `;
            summaryList.appendChild(summaryItem);
        }
    });

    if (hasItems) {
        emptyMsg.style.display = 'none';
        summaryTotal.style.display = 'flex';
        totalPriceEl.innerText = formatPrice(total);
    } else {
        summaryList.appendChild(emptyMsg);
        emptyMsg.style.display = 'block';
        summaryTotal.style.display = 'none';
    }
}

// Globally referenceable remover
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

function addLookbookToCart() {
    let itemsAdded = 0;
    Object.keys(currentLookbook).forEach(cat => {
        const item = currentLookbook[cat];
        if (item) {
            addToCart(item.id, 1);
            itemsAdded++;
        }
    });

    if (itemsAdded > 0) {
        resetLookbook();
        openCart();
    } else {
        showToast('Lütfen önce kombinlemek için en az bir ürün seçin.');
    }
}

// 10. PRODUCT DETAIL MODAL LOGIC
function initModalEvents() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const qtyMinus = document.getElementById('modalQtyMinus');
    const qtyPlus = document.getElementById('modalQtyPlus');
    const qtyInput = document.getElementById('modalQtyInput');
    const modalAddCartBtn = document.getElementById('modalAddToCartBtn');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeProductModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProductModal();
        });
    }

    if (qtyMinus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });
    }

    if (qtyPlus && qtyInput) {
        qtyPlus.addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            qtyInput.value = val + 1;
        });
    }

    if (modalAddCartBtn) {
        modalAddCartBtn.addEventListener('click', () => {
            if (selectedProductForModal) {
                const qty = parseInt(qtyInput.value) || 1;
                addToCart(selectedProductForModal.id, qty);
                closeProductModal();
                openCart();
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
    document.getElementById('modalPrice').innerText = formatPrice(product.price);
    document.getElementById('modalDesc').innerText = product.description;
    document.getElementById('modalReviewsCount').innerText = `(${product.reviews} Müşteri Yorumu)`;
    
    // Rating Stars
    document.getElementById('modalStars').innerHTML = getStarsSVG(product.rating);
    


    // Reset Qty
    document.getElementById('modalQtyInput').value = 1;

    modal.classList.add('open');
};

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('open');
        selectedProductForModal = null;
    }
}

// 11. TOAST NOTIFICATION
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
