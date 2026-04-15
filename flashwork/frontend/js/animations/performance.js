/**
 * Performance Monitoring and Device Detection Module
 * Ensures animations maintain 60fps and respects user preferences
 */

// Performance tracking state
let fpsHistory = [];
let lastFrameTime = performance.now();
let frameCount = 0;
let isMonitoring = false;

/**
 * Monitors animation performance and tracks FPS
 * @returns {Object} Performance metrics including current FPS and average FPS
 */
export function monitorPerformance() {
    if (!isMonitoring) {
        isMonitoring = true;
        trackFPS();
    }
    
    const avgFPS = fpsHistory.length > 0 
        ? fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length 
        : 60;
    
    return {
        currentFPS: fpsHistory[fpsHistory.length - 1] || 60,
        averageFPS: Math.round(avgFPS),
        isPerformant: avgFPS >= 50,
        history: [...fpsHistory]
    };
}

/**
 * Tracks FPS using requestAnimationFrame
 * @private
 */
function trackFPS() {
    const now = performance.now();
    const delta = now - lastFrameTime;
    
    frameCount++;
    
    // Calculate FPS every second
    if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        fpsHistory.push(fps);
        
        // Keep only last 10 seconds of history
        if (fpsHistory.length > 10) {
            fpsHistory.shift();
        }
        
        frameCount = 0;
        lastFrameTime = now;
        
        // Log warning if FPS drops below threshold
        if (fps < 50 && window.DEBUG_ANIMATIONS) {
            console.warn(`Low FPS detected: ${fps}fps`);
        }
    }
    
    if (isMonitoring) {
        requestAnimationFrame(trackFPS);
    }
}

/**
 * Detects device capability and determines if animations should be limited
 * @returns {Object} Device capability information
 */
export function detectDeviceCapability() {
    const capability = {
        isLowEnd: false,
        cores: navigator.hardwareConcurrency || 2,
        memory: navigator.deviceMemory || 4,
        connection: getConnectionType(),
        shouldLimitAnimations: false
    };
    
    // Detect low-end devices
    if (capability.cores <= 2 || capability.memory <= 2) {
        capability.isLowEnd = true;
        capability.shouldLimitAnimations = true;
    }
    
    // Check connection type
    if (capability.connection === 'slow-2g' || capability.connection === '2g') {
        capability.shouldLimitAnimations = true;
    }
    
    // Check if performance is degraded
    const perfMetrics = monitorPerformance();
    if (perfMetrics.averageFPS < 50) {
        capability.shouldLimitAnimations = true;
    }
    
    return capability;
}

/**
 * Gets the connection type from Network Information API
 * @private
 * @returns {string} Connection type
 */
function getConnectionType() {
    if ('connection' in navigator) {
        return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export function prefersReducedMotion() {
    if (typeof window === 'undefined') return false;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
}

/**
 * Feature detection for various browser capabilities
 * @returns {Object} Object with feature support flags
 */
export function detectFeatures() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)') || 
                       CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
        transforms: CSS.supports('transform', 'translateX(0)'),
        customProperties: CSS.supports('--custom', '0'),
        requestAnimationFrame: 'requestAnimationFrame' in window,
        performanceAPI: 'performance' in window
    };
    
    return features;
}

/**
 * Applies fallback classes based on feature detection
 */
export function applyFeatureFallbacks() {
    const features = detectFeatures();
    const body = document.body;
    
    if (!features.backdropFilter) {
        body.classList.add('no-backdrop-filter');
    }
    
    if (!features.intersectionObserver) {
        body.classList.add('no-intersection-observer');
    }
    
    if (!features.transforms) {
        body.classList.add('no-transforms');
    }
    
    if (prefersReducedMotion()) {
        body.classList.add('reduce-motion');
    }
    
    const capability = detectDeviceCapability();
    if (capability.shouldLimitAnimations) {
        body.classList.add('limit-animations');
    }
}

/**
 * Stops performance monitoring
 */
export function stopMonitoring() {
    isMonitoring = false;
}

/**
 * Resets performance history
 */
export function resetPerformanceHistory() {
    fpsHistory = [];
    frameCount = 0;
    lastFrameTime = performance.now();
}

/**
 * Safe animation wrapper that respects reduced motion and performance
 * @param {HTMLElement} element - Target element
 * @param {Function} animationFn - Animation function to execute
 * @param {Object} options - Options for animation
 */
export function safeAnimate(element, animationFn, options = {}) {
    try {
        // Check if reduced motion is preferred
        if (prefersReducedMotion() && !options.essential) {
            if (window.DEBUG_ANIMATIONS) {
                console.log('Animation skipped: reduced motion preferred');
            }
            return;
        }
        
        // Check if element exists
        if (!element) {
            console.warn('Animation target element not found');
            return;
        }
        
        // Check device capability
        const capability = detectDeviceCapability();
        if (capability.shouldLimitAnimations && !options.essential) {
            if (window.DEBUG_ANIMATIONS) {
                console.log('Animation limited: low-end device or poor performance');
            }
            // Apply instant state change instead of animation
            if (options.fallback) {
                options.fallback(element);
            }
            return;
        }
        
        // Execute animation
        animationFn(element);
        
    } catch (error) {
        console.error('Animation error:', error);
        // Ensure element is visible even if animation fails
        element.style.opacity = '1';
        element.style.transform = 'none';
    }
}

// Debug mode
if (typeof window !== 'undefined') {
    window.DEBUG_ANIMATIONS = false; // Set to true for debugging
}
