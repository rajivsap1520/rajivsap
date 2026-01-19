/**
 * Scroll-based Animations
 * Using Intersection Observer API for performance
 */

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initScrollReveal();
});

/**
 * Initialize scroll-based animations for elements with .slide-up class
 */
function initScrollAnimations() {
    // Configuration for Intersection Observer
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px 0px -100px 0px', // Trigger animation 100px before element enters viewport
        threshold: 0.1 // Trigger when 10% of element is visible
    };

    // Callback function for observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'visible' class to trigger animation
                entry.target.classList.add('visible');

                // Optional: Stop observing after animation (one-time animation)
                // Uncomment next line if you want animation to happen only once
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create observer instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with .slide-up class
    const animatedElements = document.querySelectorAll('.slide-up');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Staggered animation for grid items
 * Adds a slight delay between each item for a wave effect
 */
function initScrollReveal() {
    const grids = document.querySelectorAll('.features-grid, .trust-grid, .audience-grid, .safety-grid');

    grids.forEach(grid => {
        const items = grid.querySelectorAll('.slide-up');

        items.forEach((item, index) => {
            // Add staggered delay based on index
            item.style.transitionDelay = `${index * 100}ms`;
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
document.addEventListener('DOMContentLoaded', function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#" or "#download" (placeholder links)
            if (href === '#' || href === '#download' || href === '#contact') {
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

/**
 * Add parallax effect to hero section (optional enhancement)
 */
function initParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-mockup');

        if (parallax && scrolled < hero.offsetHeight) {
            // Move mockup slightly slower than scroll for depth effect
            parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Uncomment to enable parallax effect
// initParallax();

/**
 * Animate trust badges on hover (icon scale effect)
 */
document.addEventListener('DOMContentLoaded', function () {
    const trustBadges = document.querySelectorAll('.trust-badge-icon');

    trustBadges.forEach(icon => {
        const parent = icon.closest('.trust-badge');

        if (parent) {
            parent.addEventListener('mouseenter', function () {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            });

            parent.addEventListener('mouseleave', function () {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    });
});

/**
 * Counter animation for stats (if stats are added in future)
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS

    const timer = setInterval(() => {
        start += increment;

        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/**
 * Lazy load images (for future image additions)
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Initialize lazy loading
initLazyLoading();
