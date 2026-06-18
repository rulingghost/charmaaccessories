// ==========================================================================
// CHARME ACCESSORIES - APPLICATION SCRIPT (Flat brochure edition)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeaderScroll();
    initMobileMenu();
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

// Mobile Menu toggler
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

// 3. SMOOTH SCROLL FOR NAV MENU LINKS
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
