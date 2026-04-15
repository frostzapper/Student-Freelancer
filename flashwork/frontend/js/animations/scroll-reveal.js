/**
 * Scroll Reveal Animation Module
 * Reveals elements as they enter the viewport
 */

import { prefersReducedMotion } from './performance.js';

/**
 * Initializes scroll reveal animations
 * @param {string} selector - CSS selector for elements to reveal (default: '[data-reveal]')
 * @param {Object} options - Intersection Observer options
 * @returns {IntersectionObserver} The observer instance
 */
export function initScrollReveal(selector = '[data-reveal]', options = {}) {
    const {
        threshold = 0.1,
        rootMargin = '0px 0px -50px 0px',
        once = true,
        stagger = false,
        staggerDelay = 100
    } = options;
    
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        // Make all elements visible immediately
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.classList.add('is-visible'));
        return null;
    }
    
    const elements = document.querySelectorAll(selector);
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        console.warn('Intersection Observer not supported, revealing all elements');
        elements.forEach(el => el.classList.add('is-visible'));
        return null;
    }
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Apply stagger delay if enabled
                if (stagger) {
                    const delay = parseInt(element.dataset.revealDelay) || (index * staggerDelay);
                    setTimeout(() => {
                        element.classList.add('is-visible');
                    }, delay);
                } else {
                    element.classList.add('is-visible');
                }
                
                // Unobserve if once is true
                if (once) {
                    observer.unobserve(element);
                }
            } else if (!once) {
                // Remove visible class if element leaves viewport and once is false
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold,
        rootMargin
    });
    
    // Observe all elements
    elements.forEach(element => {
        // Add reveal-on-scroll class if not present
        if (!element.classList.contains('reveal-on-scroll')) {
            element.classList.add('reveal-on-scroll');
        }
        observer.observe(element);
    });
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Scroll reveal initialized on ${elements.length} elements`);
    }
    
    return observer;
}

/**
 * Initializes stagger reveal for list items
 * @param {string} containerSelector - CSS selector for list container
 * @param {string} itemSelector - CSS selector for list items (default: 'li, .list-item')
 * @param {number} staggerDelay - Delay between items in ms (default: 100)
 */
export function initStaggerReveal(containerSelector, itemSelector = 'li, .list-item', staggerDelay = 100) {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        return;
    }
    
    const containers = document.querySelectorAll(containerSelector);
    
    containers.forEach(container => {
        const items = container.querySelectorAll(itemSelector);
        
        // Add reveal class and delay to each item
        items.forEach((item, index) => {
            item.classList.add('reveal-on-scroll');
            item.dataset.revealDelay = index * staggerDelay;
        });
        
        // Observe container
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger reveal for all items with stagger
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('is-visible');
                        }, index * staggerDelay);
                    });
                    
                    // Unobserve container
                    observer.unobserve(container);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(container);
    });
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Stagger reveal initialized on ${containers.length} containers`);
    }
}

/**
 * Initializes sticky navbar with blur effect on scroll
 * @param {string} navbarSelector - CSS selector for navbar (default: '.navbar, .landing-navbar')
 * @param {number} scrollThreshold - Scroll distance to trigger blur (default: 50)
 */
export function initStickyNavbar(navbarSelector = '.navbar, .landing-navbar', scrollThreshold = 50) {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        return;
    }
    
    const navbar = document.querySelector(navbarSelector);
    if (!navbar) {
        if (window.DEBUG_ANIMATIONS) {
            console.warn('Navbar not found for sticky blur effect');
        }
        return;
    }
    
    let isScrolled = false;
    
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (scrollY > scrollThreshold && !isScrolled) {
            navbar.classList.add('navbar-scrolled');
            isScrolled = true;
        } else if (scrollY <= scrollThreshold && isScrolled) {
            navbar.classList.remove('navbar-scrolled');
            isScrolled = false;
        }
    }
    
    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Check initial state
    handleScroll();
    
    if (window.DEBUG_ANIMATIONS) {
        console.log('Sticky navbar initialized');
    }
}

/**
 * Enables smooth scrolling for anchor links
 * @param {string} selector - CSS selector for anchor links (default: 'a[href^="#"]')
 */
export function initSmoothScroll(selector = 'a[href^="#"]') {
    const links = document.querySelectorAll(selector);
    
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            // Prevent default jump
            event.preventDefault();
            
            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, href);
            }
        });
    });
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Smooth scroll initialized on ${links.length} links`);
    }
}

/**
 * Reveals an element programmatically
 * @param {HTMLElement} element - Element to reveal
 * @param {number} delay - Delay before reveal in ms (default: 0)
 */
export function revealElement(element, delay = 0) {
    if (!element) return;
    
    setTimeout(() => {
        element.classList.add('reveal-on-scroll', 'is-visible');
    }, delay);
}

/**
 * Hides a revealed element
 * @param {HTMLElement} element - Element to hide
 */
export function hideElement(element) {
    if (!element) return;
    element.classList.remove('is-visible');
}

/**
 * Creates a parallax scroll effect
 * @param {string} selector - CSS selector for parallax elements
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 */
export function initParallax(selector, speed = 0.5) {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        return;
    }
    
    const elements = document.querySelectorAll(selector);
    
    function handleScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const offset = (scrollY - elementTop) * speed;
            
            element.style.transform = `translateY(${offset}px)`;
        });
    }
    
    // Add scroll listener with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Parallax initialized on ${elements.length} elements`);
    }
}

// Add CSS for navbar scrolled state
if (typeof document !== 'undefined') {
    const styleId = 'scroll-reveal-styles';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .navbar-scrolled {
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                background-color: rgba(255, 255, 255, 0.9) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: backdrop-filter var(--duration-fast) var(--ease-out),
                            background-color var(--duration-fast) var(--ease-out),
                            box-shadow var(--duration-fast) var(--ease-out);
            }
            
            .no-backdrop-filter .navbar-scrolled {
                background-color: rgba(255, 255, 255, 0.95) !important;
            }
        `;
        document.head.appendChild(style);
    }
}
