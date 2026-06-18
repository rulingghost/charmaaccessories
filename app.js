// ==========================================================================
// CHARME ACCESSORIES - APPLICATION SCRIPT (Showroom static brochure edition)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeaderScroll();
    initMobileMenu();
    initInquiryActions();
    initSmoothScroll();
});

// 1. CUSTOM CURSOR LOGIC
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
        if (e.target.closest('a, button, input, textarea, .collection-item-card')) {
            document.body.classList.add('hover-interactive');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.target.closest('a, button, input, textarea, .collection-item-card')) {
            document.body.classList.remove('hover-interactive');
        }
    });
}

// 2. HEADER & MOBILE MENU LOGIC
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

// 3. SHOWROOM INQUIRY REDIRECTS
function initInquiryActions() {
    const inquireBtns = document.querySelectorAll('.collection-inquire-btn');
    const msgInput = document.getElementById('formMsg');
    const contactSection = document.getElementById('contact');

    inquireBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const itemName = btn.getAttribute('data-item');
            if (msgInput && contactSection) {
                msgInput.value = `Merhaba, Kızılay showroomunuzda sergilenen "${itemName}" koleksiyonunu yakından incelemek ve ziyaret randevusu oluşturmak istiyorum.`;
                
                // Scroll smoothly to contact form
                contactSection.scrollIntoView({ behavior: 'smooth' });
                showToast('Koleksiyon detayı randevu formuna aktarıldı.');
            }
        });
    });
}

// 4. SMOOTH SCROLL FOR NAV MENU LINKS
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                // Remove active class from other links
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                
                // Add active class if this is a nav-link
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }

                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 5. TOAST NOTIFICATION
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
