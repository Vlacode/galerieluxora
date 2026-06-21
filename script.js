// ==================== THEME MANAGEMENT ====================
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

/**
 * Initialize theme system
 * Saves user preference to localStorage
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'clair';
    setTheme(savedTheme);
}

/**
 * Set the current theme
 * @param {string} theme - Theme name ('clair' or 'sombre')
 */
function setTheme(theme) {
    const isDark = theme === 'sombre';
    body.className = isDark ? 'theme-sombre' : 'theme-clair';
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('theme-sombre') ? 'sombre' : 'clair';
    const newTheme = currentTheme === 'sombre' ? 'clair' : 'sombre';
    setTheme(newTheme);
});

// Initialize theme on page load
initTheme();

// ==================== CART FUNCTIONALITY ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Add product to cart with visual feedback
 * @param {HTMLElement} button - The clicked button element
 * @param {string} productName - Product name
 * @param {string} productPrice - Product price
 */
function addToCart(button, productName, productPrice) {
    // Add to cart array
    cart.push({ name: productName, price: productPrice, id: Date.now() });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Visual feedback
    showAddedToCartNotification(button, productName);
    animateCartButton(button);
}

/**
 * Display notification when item is added to cart
 * @param {HTMLElement} button - The button element
 * @param {string} productName - Name of the product added
 */
function showAddedToCartNotification(button, productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `✓ ${productName} ajouté au panier`;
    document.body.appendChild(notification);

    // Animate notification
    setTimeout(() => notification.classList.add('show'), 50);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Animate the cart button when clicked
 * @param {HTMLElement} button - The button element
 */
function animateCartButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// ==================== CART BUTTONS EVENT LISTENERS ====================
document.querySelectorAll('.btn-cart').forEach((button) => {
    button.addEventListener('click', () => {
        // Get product info from the nearest card
        const card = button.closest('.card');
        const productName = card.getAttribute('data-name');
        const productPrice = card.getAttribute('data-price');

        addToCart(button, productName, productPrice);
    });

    // Accessibility: handle Enter key
    button.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            button.click();
        }
    });
});

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
/**
 * Animate cards when they come into view
 * Provides better performance for initial page load
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.card').forEach((card) => {
    cardObserver.observe(card);
});

// ==================== SMOOTH SCROLLING ==================== 
/**
 * Handle smooth scrolling for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== PRODUCT INTERACTION ENHANCEMENTS ====================
/**
 * Add hover state to product cards with keyboard navigation
 */
document.querySelectorAll('.card').forEach((card) => {
    // Keyboard focus styles
    card.addEventListener('focus', function () {
        this.style.outline = '2px solid var(--color-primary)';
        this.style.outlineOffset = '4px';
    }, true);

    card.addEventListener('blur', function () {
        this.style.outline = 'none';
    }, true);

    // Keyboard Enter to activate card interaction
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target === card) {
            const button = card.querySelector('.btn-cart');
            if (button) button.click();
        }
    });
});

// ==================== UTILITY: CONSOLE MESSAGES ====================
/**
 * Log cart contents for debugging
 */
function logCart() {
    console.log('🛒 Panier actuel:', cart);
}

// Make logCart globally available for debugging
window.logCart = logCart;

// ==================== STYLE INJECTION FOR DYNAMIC NOTIFICATION ==================== 
/**
 * Inject styles for cart notification
 */
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #51cf66, #40c057);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(81, 207, 102, 0.3);
        font-weight: 600;
        animation: slideInNotification 0.4s ease forwards;
        z-index: 2000;
        opacity: 0;
    }

    .cart-notification.show {
        opacity: 1;
    }

    @keyframes slideInNotification {
        from {
            opacity: 0;
            transform: translateX(100px) translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0) translateY(0);
        }
    }

    @media (max-width: 768px) {
        .cart-notification {
            bottom: 10px;
            right: 10px;
            padding: 0.9rem 1.2rem;
            font-size: 0.95rem;
        }
    }
`;
document.head.appendChild(style);