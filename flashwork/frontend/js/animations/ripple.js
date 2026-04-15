/**
 * Ripple Effect Module
 * Creates Material Design-style ripple effects on button clicks
 */

/**
 * Creates a ripple effect on an element
 * @param {HTMLElement} element - Target element for ripple effect
 * @param {MouseEvent} event - Click event containing coordinates
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Ripple animation duration in ms (default: 600)
 * @param {string} options.color - Ripple color (default: 'rgba(255, 255, 255, 0.3)')
 * @param {number} options.scale - Final scale of ripple (default: 2.5)
 */
export function createRipple(element, event, options = {}) {
    const {
        duration = 600,
        color = 'rgba(255, 255, 255, 0.3)',
        scale = 2.5
    } = options;
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    // Calculate ripple size based on element dimensions
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const diameter = size * scale;
    
    // Calculate position relative to element
    const x = event.clientX - rect.left - (diameter / 2);
    const y = event.clientY - rect.top - (diameter / 2);
    
    // Apply styles
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.backgroundColor = color;
    ripple.style.animationDuration = `${duration}ms`;
    
    // Add ripple to element
    element.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, duration);
}

/**
 * Initializes ripple effects on all elements with data-ripple attribute
 * @param {string} selector - CSS selector for elements (default: '[data-ripple]')
 * @param {Object} options - Default options for all ripples
 */
export function initRippleEffects(selector = '[data-ripple]', options = {}) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        // Ensure element has position relative or absolute
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }
        
        // Ensure element has overflow hidden
        if (computedStyle.overflow !== 'hidden') {
            element.style.overflow = 'hidden';
        }
        
        // Add click event listener
        element.addEventListener('click', (event) => {
            // Get custom options from data attributes
            const customOptions = {
                ...options,
                duration: parseInt(element.dataset.rippleDuration) || options.duration,
                color: element.dataset.rippleColor || options.color,
                scale: parseFloat(element.dataset.rippleScale) || options.scale
            };
            
            createRipple(element, event, customOptions);
        });
    });
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Ripple effects initialized on ${elements.length} elements`);
    }
}

/**
 * Adds ripple effect to a specific element programmatically
 * @param {HTMLElement} element - Target element
 * @param {Object} options - Ripple options
 */
export function addRippleToElement(element, options = {}) {
    if (!element) {
        console.warn('Cannot add ripple: element not found');
        return;
    }
    
    // Ensure proper styling
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
        element.style.position = 'relative';
    }
    if (computedStyle.overflow !== 'hidden') {
        element.style.overflow = 'hidden';
    }
    
    // Add data attribute
    element.setAttribute('data-ripple', '');
    
    // Add click listener
    element.addEventListener('click', (event) => {
        createRipple(element, event, options);
    });
}

// Add CSS for ripple animation if not already present
if (typeof document !== 'undefined') {
    const styleId = 'ripple-animation-styles';
    
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-animation var(--ripple-duration, 600ms) ease-out;
                pointer-events: none;
                z-index: 1;
            }
            
            @keyframes ripple-animation {
                from {
                    transform: scale(0);
                    opacity: var(--ripple-opacity, 0.3);
                }
                to {
                    transform: scale(var(--ripple-scale, 2.5));
                    opacity: 0;
                }
            }
            
            /* Ensure buttons with ripple have proper positioning */
            [data-ripple] {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
}
