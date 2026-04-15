/**
 * Counter Animation Module
 * Animates numbers from start to end value with easing
 */

import { prefersReducedMotion } from './performance.js';

/**
 * Easing function for counter animation
 * @param {number} t - Progress (0 to 1)
 * @returns {number} Eased value
 */
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Animates a number from start to end value
 * @param {HTMLElement} element - Target element to display the number
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms (default: 1000)
 * @param {Function} formatter - Optional value formatter function
 * @returns {Promise} Resolves when animation completes
 */
export function animateCounter(element, start, end, duration = 1000, formatter = null) {
    return new Promise((resolve) => {
        // Skip animation if reduced motion is preferred
        if (prefersReducedMotion()) {
            element.textContent = formatter ? formatter(end) : end;
            resolve();
            return;
        }
        
        const startTime = performance.now();
        const difference = end - start;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing
            const easedProgress = easeOutExpo(progress);
            
            // Calculate current value
            const currentValue = start + (difference * easedProgress);
            
            // Format and display
            const displayValue = formatter ? formatter(currentValue) : Math.round(currentValue);
            element.textContent = displayValue;
            
            // Continue animation or resolve
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is exact
                element.textContent = formatter ? formatter(end) : end;
                resolve();
            }
        }
        
        requestAnimationFrame(updateCounter);
    });
}

/**
 * Formats a number as currency
 * @param {number} value - Number to format
 * @param {string} currency - Currency symbol (default: '₹')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, currency = '₹') {
    return `${currency}${Math.round(value).toLocaleString('en-IN')}`;
}

/**
 * Formats a number with commas
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
    return Math.round(value).toLocaleString('en-IN');
}

/**
 * Formats a number as percentage
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 0) {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Initializes counter animations for all elements with data-counter attribute
 * @param {string} selector - CSS selector for counter elements (default: '[data-counter]')
 * @param {Object} options - Default options for all counters
 */
export function initCounterAnimations(selector = '[data-counter]', options = {}) {
    const {
        duration = 1000,
        observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        }
    } = options;
    
    const elements = document.querySelectorAll(selector);
    
    // Use Intersection Observer to trigger animations when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Skip if already animated
                if (element.dataset.animated === 'true') {
                    return;
                }
                
                // Get target value
                const target = parseFloat(element.dataset.target || element.textContent);
                const start = parseFloat(element.dataset.start || 0);
                
                // Get custom duration
                const customDuration = parseInt(element.dataset.duration) || duration;
                
                // Determine formatter
                let formatter = null;
                const format = element.dataset.format;
                
                if (format === 'currency') {
                    const currency = element.dataset.currency || '₹';
                    formatter = (value) => formatCurrency(value, currency);
                } else if (format === 'number') {
                    formatter = formatNumber;
                } else if (format === 'percentage') {
                    const decimals = parseInt(element.dataset.decimals) || 0;
                    formatter = (value) => formatPercentage(value, decimals);
                }
                
                // Animate counter
                animateCounter(element, start, target, customDuration, formatter)
                    .then(() => {
                        element.dataset.animated = 'true';
                    });
                
                // Unobserve after animation starts (animate once)
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Observe all counter elements
    elements.forEach(element => observer.observe(element));
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Counter animations initialized on ${elements.length} elements`);
    }
    
    return observer;
}

/**
 * Animates multiple counters in sequence with stagger delay
 * @param {HTMLElement[]} elements - Array of elements to animate
 * @param {number} staggerDelay - Delay between each counter in ms (default: 100)
 * @param {Object} options - Options for each counter
 */
export async function animateCountersStaggered(elements, staggerDelay = 100, options = {}) {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const target = parseFloat(element.dataset.target || element.textContent);
        const start = parseFloat(element.dataset.start || 0);
        
        // Start animation
        animateCounter(element, start, target, options.duration, options.formatter);
        
        // Wait for stagger delay before next counter
        if (i < elements.length - 1) {
            await new Promise(resolve => setTimeout(resolve, staggerDelay));
        }
    }
}

/**
 * Creates a live counter that updates in real-time
 * @param {HTMLElement} element - Target element
 * @param {Function} valueGetter - Function that returns current value
 * @param {number} updateInterval - Update interval in ms (default: 1000)
 * @param {Function} formatter - Optional formatter function
 * @returns {Function} Stop function to stop the counter
 */
export function createLiveCounter(element, valueGetter, updateInterval = 1000, formatter = null) {
    let previousValue = valueGetter();
    element.textContent = formatter ? formatter(previousValue) : previousValue;
    
    const intervalId = setInterval(() => {
        const newValue = valueGetter();
        
        if (newValue !== previousValue) {
            animateCounter(element, previousValue, newValue, 500, formatter);
            previousValue = newValue;
        }
    }, updateInterval);
    
    // Return stop function
    return () => clearInterval(intervalId);
}
