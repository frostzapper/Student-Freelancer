# Animation Integration Guide

This guide explains how to add animations to any HTML page in the FlashWork application.

## Quick Start

### 1. Add CSS Files to `<head>`

Add these lines after your existing CSS imports:

```html
<link rel="stylesheet" href="../css/animations.css?v=2">
<link rel="stylesheet" href="../css/transitions.css?v=2">
<link rel="stylesheet" href="../css/loading-states.css?v=2">
```

**Example:**
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    <link rel="stylesheet" href="../css/global.css?v=2">
    <link rel="stylesheet" href="../css/animations.css?v=2">
    <link rel="stylesheet" href="../css/transitions.css?v=2">
    <link rel="stylesheet" href="../css/loading-states.css?v=2">
    <link rel="stylesheet" href="../css/components.css?v=2">
    <!-- Other CSS files -->
</head>
```

### 2. Add Animation Script Before `</body>`

Add this line before the closing `</body>` tag:

```html
<script type="module" src="../js/init-animations.js"></script>
</body>
</html>
```

### 3. Add Data Attributes to Elements

#### Buttons - Add Ripple Effect
```html
<button class="btn btn-primary" data-ripple>
    Click Me
</button>
```

#### Cards - Reveal on Scroll
```html
<div class="job-card" data-reveal>
    <!-- Card content -->
</div>
```

#### Numbers - Animated Counters
```html
<!-- Currency -->
<div class="stat-value" data-counter data-target="5000" data-format="currency">
    ₹0
</div>

<!-- Regular Number -->
<div class="stat-value" data-counter data-target="42" data-format="number">
    0
</div>

<!-- Percentage -->
<div class="stat-value" data-counter data-target="95.5" data-format="percentage" data-decimals="1">
    0%
</div>
```

## Animation Types

### 1. Ripple Effects (Buttons)

**Usage:**
```html
<button class="btn" data-ripple>Button</button>
```

**Custom Options:**
```html
<button class="btn" 
        data-ripple 
        data-ripple-color="rgba(255, 255, 255, 0.5)"
        data-ripple-duration="800">
    Custom Ripple
</button>
```

### 2. Scroll Reveal (Cards, Sections)

**Usage:**
```html
<div class="card" data-reveal>Content</div>
```

**With Custom Delay:**
```html
<div class="card" data-reveal data-reveal-delay="200">Content</div>
```

**Staggered List:**
```html
<div class="job-list">
    <div class="job-card" data-reveal>Job 1</div>
    <div class="job-card" data-reveal>Job 2</div>
    <div class="job-card" data-reveal>Job 3</div>
</div>
```

### 3. Counter Animations (Numbers)

**Currency:**
```html
<span data-counter data-target="1250" data-format="currency">₹0</span>
```

**Number:**
```html
<span data-counter data-target="42" data-format="number">0</span>
```

**Percentage:**
```html
<span data-counter data-target="87.5" data-format="percentage" data-decimals="1">0%</span>
```

**Custom Duration:**
```html
<span data-counter data-target="1000" data-duration="2000">0</span>
```

### 4. Loading States

**Skeleton Loader:**
```html
<div class="skeleton skeleton-card">
    <div class="skeleton-card-header">
        <div class="skeleton skeleton-card-title"></div>
        <div class="skeleton skeleton-card-badge"></div>
    </div>
    <div class="skeleton-card-body">
        <div class="skeleton skeleton-card-text"></div>
        <div class="skeleton skeleton-card-text"></div>
        <div class="skeleton skeleton-card-text"></div>
    </div>
</div>
```

**Replace with Content:**
```javascript
// Hide skeleton, show content
document.querySelector('.skeleton-card').style.display = 'none';
document.querySelector('.actual-content').classList.add('fade-in-content');
```

### 5. Modal Animations

**HTML Structure:**
```html
<div class="modal-overlay backdrop-blur" id="myModal">
    <div class="modal-content">
        <h2>Modal Title</h2>
        <p>Modal content...</p>
        <button class="btn" data-ripple onclick="closeModal()">Close</button>
    </div>
</div>
```

**JavaScript:**
```javascript
function openModal() {
    const modal = document.getElementById('myModal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('myModal');
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('show', 'closing');
    }, 200);
}
```

### 6. Toast Notifications

**Already Integrated in utils.js:**
```javascript
import { showToast } from './utils.js';

showToast('Success message!', 'success', 3000);
showToast('Error message!', 'error', 3000);
showToast('Info message!', 'info', 3000);
```

## Icon Replacements

Replace emojis with SVG icons:

### Common Icons

**Money/Currency:**
```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
</svg>
```

**Checkmark:**
```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
</svg>
```

**Lightning (Fast/Urgent):**
```html
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
</svg>
```

## Pages Already Updated

✅ Landing page (index.html)
✅ Client Dashboard (client/dashboard.html)

## Pages To Update

Apply the same pattern to:
- [ ] client/my-jobs.html
- [ ] client/post-job.html
- [ ] client/job-detail.html
- [ ] client/wallet.html
- [ ] worker/dashboard.html
- [ ] worker/browse.html
- [ ] worker/active-jobs.html
- [ ] worker/job-detail.html
- [ ] worker/profile.html
- [ ] worker/schedule.html
- [ ] worker/wallet.html
- [ ] worker/recommended.html
- [ ] login.html
- [ ] register.html
- [ ] wallet.html

## Testing Checklist

After adding animations to a page:

- [ ] Buttons have ripple effect on click
- [ ] Cards reveal smoothly on scroll
- [ ] Numbers count up when visible
- [ ] Modals open/close smoothly
- [ ] Toast notifications slide in from right
- [ ] Page loads with smooth transition
- [ ] No emojis visible
- [ ] Animations respect `prefers-reduced-motion`

## Troubleshooting

### Animations Not Working

1. Check browser console for errors
2. Verify CSS files are loaded (check Network tab)
3. Ensure `init-animations.js` is loaded
4. Check data attributes are spelled correctly

### Performance Issues

1. Reduce number of animated elements
2. Use `data-reveal` sparingly on large lists
3. Enable performance monitoring:
   ```javascript
   window.DEBUG_ANIMATIONS = true;
   ```

### Reduced Motion

Test with reduced motion enabled:
- Windows: Settings > Ease of Access > Display > Show animations
- Mac: System Preferences > Accessibility > Display > Reduce motion
- Linux: Varies by desktop environment

## Advanced Customization

### Custom Animation Timing

Edit `css/global.css`:
```css
:root {
    --duration-fast: 200ms;    /* Quick animations */
    --duration-normal: 300ms;  /* Standard animations */
    --duration-slow: 400ms;    /* Slower animations */
}
```

### Disable Specific Animations

```javascript
// In your page's JavaScript
import { initAnimations } from '../js/init-animations.js';

initAnimations({
    enableRipple: true,
    enableCounters: true,
    enableScrollReveal: false,  // Disable scroll reveal
    enablePageTransitions: true
});
```

## Support

For issues or questions:
1. Check browser console for errors
2. Review this guide
3. Check the design document: `.kiro/specs/elegant-ui-animations/design.md`
4. Create an issue in your repository
