/**
 * Header & Navigation JavaScript
 * Handles sticky transparent header and mobile menu
 */

document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenuToggle();
    setActiveNavLink();
});

/**
 * Header Scroll Behavior - Transparent to Solid
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');

    if (!header) return;

    // Throttled scroll handler for better performance
    const handleScroll = throttleHeader(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile Menu Toggle
 */
function initMobileMenuToggle() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!menuToggle || !mobileNav) return;

    // Toggle menu on button click
    menuToggle.addEventListener('click', function (e) {
        e.stopPropagation();

        const isActive = mobileNav.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }

        // Update aria attributes
        menuToggle.setAttribute('aria-expanded', isActive);
        mobileNav.setAttribute('aria-hidden', !isActive);
    });

    // Close menu when clicking on a navigation link
    const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileNav.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';

            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = '';

            menuToggle.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
        }
    });
}

/**
 * Set Active Navigation Link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Desktop navigation
    const desktopNavLinks = document.querySelectorAll('.header-nav-link');
    desktopNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Mobile navigation
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Throttle function for scroll performance
 */
function throttleHeader(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Smooth scroll for anchor links (for single-page sections)
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's just "#" or a placeholder
        if (href === '#' || href === '#download' || href === '#contact') {
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();

            // Get header height for offset
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;

            // Calculate scroll position
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            // Smooth scroll
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
