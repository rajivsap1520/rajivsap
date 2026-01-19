/**
 * Main JavaScript Utilities
 * BizManager Landing Page
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initFormValidation();
    initCTATracking();
    logPageLoad();
});

/**
 * Mobile Menu Toggle (if navigation menu is added)
 */
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('active');
            this.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
                menu.classList.remove('active');
                menuButton.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Form Validation (for contact forms if added later)
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Submit form
                console.log('Form is valid, submitting...');
                // form.submit(); // Uncomment when ready to submit
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });
        });
    });
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    removeError(field);

    // Check if required field is empty
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation (Indian format)
    if (type === 'tel' && value !== '') {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit phone number';
        }
    }

    // Show error if validation failed
    if (!isValid) {
        showError(field, errorMessage);
    }

    return isValid;
}

/**
 * Show error message for field
 */
function showError(field, message) {
    field.classList.add('error');

    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #EF4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';

    field.parentElement.appendChild(errorElement);
}

/**
 * Remove error message from field
 */
function removeError(field) {
    field.classList.remove('error');

    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Track CTA button clicks (for analytics)
 */
function initCTATracking() {
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-accent');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const buttonText = this.textContent.trim();
            const buttonHref = this.getAttribute('href');

            // Log CTA click (replace with actual analytics service)
            console.log('CTA Clicked:', {
                text: buttonText,
                href: buttonHref,
                timestamp: new Date().toISOString()
            });

            // Example: Send to Google Analytics (if integrated)
            // if (typeof gtag !== 'undefined') {
            //   gtag('event', 'cta_click', {
            //     'button_text': buttonText,
            //     'button_url': buttonHref
            //   });
            // }

            // Show placeholder message for demo links
            if (buttonHref === '#download' || buttonHref === '#contact') {
                e.preventDefault();
                showToast('Please update the download link with your actual app store URL', 'info');
            }
        });
    });
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const bgColors = {
        info: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
    };

    toast.style.cssText = `
    background-color: ${bgColors[type] || bgColors.info};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    animation: slideIn 0.3s ease;
    cursor: pointer;
  `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;

    if (!document.querySelector('style[data-toast-styles]')) {
        style.setAttribute('data-toast-styles', 'true');
        document.head.appendChild(style);
    }

    toastContainer.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Remove on click
    toast.addEventListener('click', function () {
        this.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => this.remove(), 300);
    });
}

/**
 * Log page load time (for performance monitoring)
 */
function logPageLoad() {
    if ('performance' in window) {
        window.addEventListener('load', function () {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

                console.log('Page Load Time:', pageLoadTime + 'ms');

                // Example: Send to analytics
                // if (typeof gtag !== 'undefined') {
                //   gtag('event', 'timing_complete', {
                //     'name': 'page_load',
                //     'value': pageLoadTime
                //   });
                // }
            }, 0);
        });
    }
}

/**
 * Detect slow network and show message
 */
function detectSlowNetwork() {
    if ('connection' in navigator) {
        const connection = navigator.connection;

        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            showToast('Slow network detected. Some features may load slowly.', 'warning');
        }
    }
}

detectSlowNetwork();

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function for scroll events
 */
function throttle(func, limit) {
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

// Export utilities for use in other scripts
window.BizManagerUtils = {
    showToast,
    debounce,
    throttle,
    validateField
};
