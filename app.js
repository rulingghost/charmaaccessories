// ============================================================
// CHARME ACCESSORIES – APP SCRIPT
// Billboard luxury · animated · mobile ready
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initParallax();
    initSmoothScroll();
});

// ── 1. CUSTOM CURSOR ──────────────────────────────────────
function initCursor() {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Ring follows with smooth lag
    (function animateRing() {
        rx += (mx - rx) * 0.11;
        ry += (my - ry) * 0.11;
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        requestAnimationFrame(animateRing);
    })();

    const interactables = 'a, button, .vis-card, .ct-card, .ls-sub-item, .ft-sub-logo';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(interactables)) document.body.classList.add('is-hovering');
    });
    document.addEventListener('mouseout', e => {
        if (!e.target.closest(interactables)) document.body.classList.remove('is-hovering');
    });
}

// ── 2. HEADER ─────────────────────────────────────────────
function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}

// ── 3. MOBILE MENU ────────────────────────────────────────
function initMobileMenu() {
    const burger = document.getElementById('burgerBtn');
    const nav    = document.getElementById('mainNav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ── 4. SCROLL REVEAL (staggered) ──────────────────────────
function initScrollReveal() {
    const items = document.querySelectorAll('.js-reveal');
    if (!items.length) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Stagger siblings in the same parent
            const siblings = [...entry.target.parentElement.querySelectorAll('.js-reveal:not(.visible)')];
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Math.max(0, idx) * 130);

            io.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    items.forEach(el => io.observe(el));
}

// ── 5. PARALLAX ───────────────────────────────────────────
function initParallax() {
    const heroImg  = document.getElementById('heroBgImg');
    const scrollCue = document.getElementById('scrollCue');

    // Skip on touch
    if (window.matchMedia('(pointer:coarse)').matches) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // Hero bg parallax
        if (heroImg) {
            heroImg.style.transform = `scale(1.1) translateY(${y * 0.2}px)`;
        }

        // Fade out scroll cue
        if (scrollCue) {
            scrollCue.style.opacity = Math.max(0, 1 - y / 300);
        }
    }, { passive: true });
}

// ── 6. SMOOTH SCROLL ──────────────────────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const headerH = document.getElementById('siteHeader')?.offsetHeight || 70;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
}
