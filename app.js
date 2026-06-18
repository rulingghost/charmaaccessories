// ============================================================
// CHARME ACCESSORIES – APP SCRIPT
// Premium dark showcase · animated · mobile-ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initParallax();
});

// ── 1. CUSTOM CURSOR ──────────────────────────────────────
function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let rx = 0, ry = 0;
    let mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left  = mx + 'px';
        dot.style.top   = my + 'px';
    });

    // Ring lags slightly for smooth feel
    function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .gallery-card, .contact-card, .logo-trio-item')) {
            document.body.classList.add('is-hovering');
        }
    });
    document.addEventListener('mouseout', (e) => {
        if (!e.target.closest('a, button, .gallery-card, .contact-card, .logo-trio-item')) {
            document.body.classList.remove('is-hovering');
        }
    });
}

// ── 2. HEADER SCROLL ──────────────────────────────────────
function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ── 3. MOBILE MENU ────────────────────────────────────────
function initMobileMenu() {
    const burger = document.getElementById('burgerBtn');
    const nav    = document.getElementById('mainNav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ── 4. SCROLL REVEAL (Intersection Observer) ──────────────
function initScrollReveal() {
    const els = document.querySelectorAll('.js-reveal');
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings slightly
                const siblings = [...entry.target.parentElement.querySelectorAll('.js-reveal')];
                const idx = siblings.indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 120);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    els.forEach(el => io.observe(el));
}

// ── 5. SMOOTH SCROLL ──────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}

// ── 6. SUBTLE HERO PARALLAX ───────────────────────────────
function initParallax() {
    const heroBgImg = document.getElementById('heroBgImg');
    if (!heroBgImg) return;

    // Only on non-touch
    if (window.matchMedia('(pointer:coarse)').matches) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        heroBgImg.style.transform = `scale(1.08) translateY(${y * 0.25}px)`;
    }, { passive: true });
}
