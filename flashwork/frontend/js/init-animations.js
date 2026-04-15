/**
 * Centralized Animation Initialization
 * Initializes all animation systems across the application
 */

import { prefersReducedMotion, applyFeatureFallbacks, monitorPerformance } from './animations/performance.js';
import { initRippleEffects } from './animations/ripple.js';
import { initCounterAnimations } from './animations/counter.js';
import { initScrollReveal, initStaggerReveal, initStickyNavbar, initSmoothScroll } from './animations/scroll-reveal.js';
import { initPageTransitions, initHistoryTransitions } from './animations/page-transition.js';

/**
 * Initializes all animations
 * @param {Object} options - Configuration options
 */
export function initAnimations(options = {}) {
    const {
        enableRipple = true,
        enableCounters = true,
        enableScrollReveal = true,
        enablePageTransitions = true,
        enableStickyNavbar = true,
        enableSmoothScroll = true,
        enablePerformanceMonitoring = false,
        rippleSelector = '[data-ripple]',
        counterSelector = '[data-counter]',
        revealSelector = '[data-reveal]',
        navbarSelector = '.navbar, .landing-navbar'
    } = options;
    
    // Apply feature detection fallbacks
    applyFeatureFallbacks();
    
    // Check if reduced motion is preferred
    const reducedMotion = prefersReducedMotion();
    
    if (reducedMotion) {
        console.log('Reduced motion preferred - animations disabled');
        document.body.classList.add('reduce-motion');
        return;
    }
    
    // Initialize performance monitoring if enabled
    if (enablePerformanceMonitoring) {
        monitorPerformance();
        
        // Log performance metrics every 5 seconds
        setInterval(() => {
            const metrics = monitorPerformance();
            if (window.DEBUG_ANIMATIONS) {
                console.log('Performance:', metrics);
            }
        }, 5000);
    }
    
    // Initialize ripple effects
    if (enableRipple) {
        try {
            initRippleEffects(rippleSelector);
        } catch (error) {
            console.error('Failed to initialize ripple effects:', error);
        }
    }
    
    // Initialize counter animations
    if (enableCounters) {
        try {
            initCounterAnimations(counterSelector);
        } catch (error) {
            console.error('Failed to initialize counter animations:', error);
        }
    }
    
    // Initialize scroll reveal
    if (enableScrollReveal) {
        try {
            initScrollReveal(revealSelector);
            
            // Initialize stagger reveal for lists
            initStaggerReveal('.job-list, .transaction-list, .notification-list');
        } catch (error) {
            console.error('Failed to initialize scroll reveal:', error);
        }
    }
    
    // Initialize sticky navbar
    if (enableStickyNavbar) {
        try {
            initStickyNavbar(navbarSelector);
        } catch (error) {
            console.error('Failed to initialize sticky navbar:', error);
        }
    }
    
    // Initialize smooth scrolling
    if (enableSmoothScroll) {
        try {
            initSmoothScroll();
        } catch (error) {
            console.error('Failed to initialize smooth scroll:', error);
        }
    }
    
    // Initialize page transitions
    if (enablePageTransitions) {
        try {
            initPageTransitions();
            initHistoryTransitions();
        } catch (error) {
            console.error('Failed to initialize page transitions:', error);
        }
    }
    
    if (window.DEBUG_ANIMATIONS) {
        console.log('All animations initialized successfully');
    }
}

/**
 * Initializes animations when DOM is ready
 * @param {Object} options - Configuration options
 */
export function initAnimationsOnReady(options = {}) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAnimations(options);
        });
    } else {
        initAnimations(options);
    }
}

// Auto-initialize if not in module context
if (typeof window !== 'undefined' && !window.MANUAL_ANIMATION_INIT) {
    initAnimationsOnReady();
}

// Export for manual initialization
export default initAnimations;
