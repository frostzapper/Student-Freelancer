/**
 * Page Transition Module
 * Handles smooth transitions between pages
 */

import { prefersReducedMotion } from './performance.js';

/**
 * Applies page transition animation
 * @param {string} direction - 'enter' or 'exit'
 * @param {Function} callback - Function to call after transition completes
 * @param {number} duration - Animation duration in ms
 */
export function transitionPage(direction, callback, duration = 300) {
    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion()) {
        if (callback) callback();
        return;
    }
    
    const body = document.body;
    const className = `page-transition-${direction}`;
    
    // Add transition class
    body.classList.add(className);
    
    // Remove class and call callback after animation
    setTimeout(() => {
        body.classList.remove(className);
        if (callback) callback();
    }, duration);
}

/**
 * Navigates to a new page with transition
 * @param {string} url - Target URL
 * @param {Object} options - Navigation options
 */
export function navigateWithTransition(url, options = {}) {
    const {
        exitDuration = 200,
        enterDuration = 300,
        replace = false
    } = options;
    
    // Apply exit animation
    transitionPage('exit', () => {
        // Navigate to new page
        if (replace) {
            window.location.replace(url);
        } else {
            window.location.href = url;
        }
    }, exitDuration);
}

/**
 * Initializes page transitions for all internal links
 * @param {string} selector - CSS selector for links to enhance (default: 'a[href^="/"]')
 * @param {Object} options - Default options for transitions
 */
export function initPageTransitions(selector = 'a[href^="/"]', options = {}) {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        return;
    }
    
    const links = document.querySelectorAll(selector);
    
    links.forEach(link => {
        // Skip links with data-no-transition attribute
        if (link.hasAttribute('data-no-transition')) {
            return;
        }
        
        // Skip external links
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('//')) {
            return;
        }
        
        link.addEventListener('click', (event) => {
            // Allow default behavior for special keys
            if (event.ctrlKey || event.metaKey || event.shiftKey) {
                return;
            }
            
            // Prevent default navigation
            event.preventDefault();
            
            // Navigate with transition
            navigateWithTransition(href, options);
        });
    });
    
    // Apply enter animation on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            transitionPage('enter', null, options.enterDuration);
        });
    } else {
        transitionPage('enter', null, options.enterDuration);
    }
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Page transitions initialized on ${links.length} links`);
    }
}

/**
 * Handles browser back/forward navigation with transitions
 */
export function initHistoryTransitions() {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        return;
    }
    
    window.addEventListener('popstate', () => {
        transitionPage('enter');
    });
}

/**
 * Intercepts form submissions and adds transitions
 * @param {string} selector - CSS selector for forms
 * @param {Object} options - Transition options
 */
export function initFormTransitions(selector = 'form[data-transition]', options = {}) {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion()) {
        return;
    }
    
    const forms = document.querySelectorAll(selector);
    
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            // Check if form has action URL
            const action = form.getAttribute('action');
            if (!action) return;
            
            // Prevent default submission
            event.preventDefault();
            
            // Apply exit animation then submit
            transitionPage('exit', () => {
                form.submit();
            }, options.exitDuration);
        });
    });
    
    if (window.DEBUG_ANIMATIONS) {
        console.log(`Form transitions initialized on ${forms.length} forms`);
    }
}

/**
 * Creates a smooth transition between content changes
 * @param {HTMLElement} element - Container element
 * @param {Function} contentUpdater - Function that updates the content
 * @param {number} duration - Transition duration
 */
export async function transitionContent(element, contentUpdater, duration = 300) {
    if (!element) {
        console.warn('Cannot transition content: element not found');
        return;
    }
    
    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion()) {
        contentUpdater();
        return;
    }
    
    // Fade out
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    element.style.transition = `opacity ${duration}ms var(--ease-out), transform ${duration}ms var(--ease-out)`;
    
    // Wait for fade out
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Update content
    contentUpdater();
    
    // Fade in
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Clean up
    setTimeout(() => {
        element.style.transition = '';
    }, duration);
}
