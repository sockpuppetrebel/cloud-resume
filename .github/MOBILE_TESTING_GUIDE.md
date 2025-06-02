# Mobile Testing & Development Guide

## Automated Mobile Testing

### 1. Pre-Commit Testing
Run before every commit:
```bash
./scripts/mobile-test.sh
```

### 2. CI/CD Mobile Tests
The `mobile-testing.yml` workflow runs on every PR and includes:
- **Lighthouse Mobile Audits** - Performance, accessibility, SEO
- **Responsive Screenshots** - Captures on 5 device types
- **CSS Validation** - Checks for mobile-unfriendly patterns
- **Performance Checks** - Image sizes, JS bundle size

### 3. Local Development Tools

#### Browser DevTools Testing
1. **Chrome DevTools**
   - Open DevTools (F12)
   - Click device toggle (Ctrl+Shift+M)
   - Test these viewports:
     - iPhone SE (375×667)
     - iPhone 12 (390×844)
     - iPad (768×1024)
     - Pixel 5 (393×851)

2. **Responsive Design Mode**
   - Test touch interactions
   - Check orientation changes
   - Verify text readability

#### VS Code Extensions
- **Live Server** - Test on real mobile devices on same network
- **Responsive Viewer** - Preview multiple viewports simultaneously

## Mobile-First CSS Patterns

### Always Use These Patterns

```css
/* 1. Flexible Units */
.container {
  width: 100%;
  max-width: 1200px;
  padding: 1rem; /* Use rem/em instead of px */
}

/* 2. Mobile-First Media Queries */
.element {
  /* Mobile styles (default) */
  font-size: 1rem;
}

@media (min-width: 768px) {
  .element {
    /* Tablet/Desktop overrides */
    font-size: 1.2rem;
  }
}

/* 3. Touch-Friendly Targets */
.button {
  min-height: 44px; /* Apple's recommendation */
  min-width: 44px;
  padding: 12px 24px;
}

/* 4. Flexible Images */
img {
  max-width: 100%;
  height: auto;
}

/* 5. Safe Text Sizing */
body {
  font-size: 16px; /* Prevents zoom on iOS */
}

input, textarea {
  font-size: 16px; /* Prevents zoom on focus */
}
```

### Avoid These Anti-Patterns

```css
/* ❌ Fixed widths */
.bad-container {
  width: 1000px; /* Will cause horizontal scroll */
}

/* ❌ Small touch targets */
.bad-button {
  padding: 2px 5px; /* Too small for fingers */
}

/* ❌ Hover-only interactions */
.bad-dropdown:hover {
  display: block; /* Won't work on touch */
}

/* ❌ Desktop-first media queries */
@media (max-width: 768px) {
  /* Having to override everything is harder */
}
```

## Testing Checklist

### Before Every Commit
- [ ] Run `./scripts/mobile-test.sh`
- [ ] Test in Chrome DevTools mobile mode
- [ ] Check all interactive elements are touch-friendly
- [ ] Verify no horizontal scrolling
- [ ] Ensure text is readable without zooming

### Before Deployment
- [ ] Test on real device (if possible)
- [ ] Run Lighthouse mobile audit
- [ ] Check loading performance on 3G
- [ ] Verify forms work on mobile keyboards
- [ ] Test landscape orientation

### Common Mobile Issues to Check

1. **Navigation**
   - [ ] Mobile menu works properly
   - [ ] Links are spaced adequately
   - [ ] Menu closes after selection

2. **Forms & Inputs**
   - [ ] Appropriate keyboard types (`type="email"`, etc.)
   - [ ] Labels are clickable
   - [ ] Error messages are visible

3. **Images & Media**
   - [ ] Images load quickly
   - [ ] No images cause layout shift
   - [ ] Alt text for accessibility

4. **Performance**
   - [ ] Page loads under 3 seconds on 3G
   - [ ] Smooth scrolling
   - [ ] No janky animations

## Quick Fixes for Common Issues

### Horizontal Scroll
```css
/* Add to your global styles */
html, body {
  overflow-x: hidden;
}

.problematic-element {
  max-width: 100vw;
}
```

### Text Too Small
```css
/* Ensure minimum readable size */
p, li, span {
  font-size: max(16px, 1rem);
}
```

### Touch Targets Too Small
```css
/* Make all clickable elements touch-friendly */
a, button, [role="button"] {
  position: relative;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

### Fixed Elements Covering Content
```css
/* Add safe areas for fixed elements */
.content {
  padding-bottom: 80px; /* Space for fixed footer */
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom));
  }
}
```

## Automated Testing in CI/CD

The GitHub Actions workflow will:
1. **Block PRs** if critical mobile issues are found
2. **Generate screenshots** for manual review
3. **Create Lighthouse reports** with scores
4. **Flag performance issues** (large images, etc.)

Review the artifacts in the Actions tab after each PR to see:
- Mobile screenshots across devices
- Lighthouse scores and recommendations
- Specific issues found

## Manual Testing Checklist

When automated tests pass but you want extra confidence:

1. **Real Device Testing**
   - Open staging URL on your phone
   - Try all interactions
   - Check in both orientations
   - Test on both iOS and Android if possible

2. **Network Conditions**
   - Chrome DevTools → Network → Slow 3G
   - Ensure page remains usable
   - Check loading indicators work

3. **Accessibility**
   - Enable screen reader
   - Check color contrast
   - Verify focus indicators
   - Test with larger font sizes

## Setting Up Mobile Preview

For live mobile testing during development:

```bash
# 1. Start local server
cd site
python -m http.server 8000

# 2. Find your local IP
# Mac: ifconfig | grep inet
# Windows: ipconfig

# 3. On mobile device (same network)
# Visit: http://YOUR_IP:8000
```

## Resources

- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Mobile Web Best Practices](https://web.dev/mobile/)
- [Touch Target Guidelines](https://web.dev/accessible-tap-targets/)