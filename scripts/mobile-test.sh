#!/bin/bash

# Mobile Testing Script
# Run this locally before committing to catch mobile issues

echo "======================================="
echo "Mobile Compatibility Testing"
echo "======================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Track failures
failures=0

# 1. Check viewport meta tag
echo -e "\n${YELLOW}1. Checking viewport meta tag...${NC}"
if grep -q 'viewport.*width=device-width' site/index.html; then
    echo -e "${GREEN}✓${NC} Viewport meta tag found"
else
    echo -e "${RED}✗${NC} Missing proper viewport meta tag"
    ((failures++))
fi

# 2. Check for mobile-specific CSS
echo -e "\n${YELLOW}2. Checking for responsive CSS...${NC}"
css_files=$(find site -name "*.css" 2>/dev/null)

if [ -n "$css_files" ]; then
    media_queries=$(grep -h "@media" $css_files | wc -l)
    if [ $media_queries -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Found $media_queries media queries"
    else
        echo -e "${YELLOW}⚠${NC} No media queries found - site may not be responsive"
    fi
fi

# 3. Check for touch-friendly elements
echo -e "\n${YELLOW}3. Checking touch target sizes...${NC}"
small_buttons=$(grep -E "padding:\s*[0-5]px" site/*.css 2>/dev/null | wc -l)
if [ $small_buttons -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found $small_buttons potentially small touch targets"
else
    echo -e "${GREEN}✓${NC} No obviously small touch targets found"
fi

# 4. Check for horizontal scroll issues
echo -e "\n${YELLOW}4. Checking for horizontal overflow...${NC}"
overflow_x=$(grep -r "overflow-x:\s*scroll" site/*.css 2>/dev/null | wc -l)
fixed_widths=$(grep -r "width:\s*[0-9]\{4,\}px" site/*.css 2>/dev/null | wc -l)

if [ $overflow_x -gt 0 ] || [ $fixed_widths -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found potential horizontal scroll issues"
    [ $overflow_x -gt 0 ] && echo "  - $overflow_x overflow-x:scroll rules"
    [ $fixed_widths -gt 0 ] && echo "  - $fixed_widths large fixed widths"
else
    echo -e "${GREEN}✓${NC} No horizontal overflow issues detected"
fi

# 5. Check image optimization
echo -e "\n${YELLOW}5. Checking image optimization...${NC}"
large_images=0
for img in site/*.{jpg,jpeg,png,gif} 2>/dev/null; do
    if [ -f "$img" ]; then
        size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img")
        if [ $size -gt 500000 ]; then
            echo -e "${YELLOW}⚠${NC} $(basename $img): $(($size/1024))KB (consider optimizing)"
            ((large_images++))
        fi
    fi
done

if [ $large_images -eq 0 ]; then
    echo -e "${GREEN}✓${NC} All images are reasonably sized"
fi

# 6. Check font sizes
echo -e "\n${YELLOW}6. Checking readable font sizes...${NC}"
small_fonts=$(grep -E "font-size:\s*([0-9]|1[0-1])px" site/*.css 2>/dev/null | wc -l)
if [ $small_fonts -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found $small_fonts instances of small fonts (<12px)"
else
    echo -e "${GREEN}✓${NC} Font sizes appear mobile-friendly"
fi

# 7. Check for mobile-unfriendly interactions
echo -e "\n${YELLOW}7. Checking interaction patterns...${NC}"
hover_only=$(grep -r ":hover" site/*.css 2>/dev/null | grep -v "@media" | wc -l)
if [ $hover_only -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found $hover_only :hover rules - ensure touch alternatives exist"
fi

# 8. Local server test with Lighthouse (if available)
echo -e "\n${YELLOW}8. Running Lighthouse mobile audit...${NC}"
if command -v lighthouse >/dev/null 2>&1; then
    # Start local server
    cd site
    python3 -m http.server 8888 >/dev/null 2>&1 &
    SERVER_PID=$!
    sleep 2
    
    # Run Lighthouse
    lighthouse http://localhost:8888 \
        --emulated-form-factor=mobile \
        --only-categories=accessibility,best-practices,seo \
        --output=json \
        --output-path=../lighthouse-mobile.json \
        --quiet
    
    # Kill server
    kill $SERVER_PID 2>/dev/null
    cd ..
    
    # Parse results
    if [ -f lighthouse-mobile.json ]; then
        scores=$(python3 -c "
import json
with open('lighthouse-mobile.json') as f:
    data = json.load(f)
    for cat in ['accessibility', 'best-practices', 'seo']:
        score = int(data['categories'][cat]['score'] * 100)
        print(f'{cat}: {score}%')
" 2>/dev/null)
        
        if [ -n "$scores" ]; then
            echo -e "${GREEN}✓${NC} Lighthouse scores:"
            echo "$scores" | sed 's/^/  /'
        fi
        rm lighthouse-mobile.json
    fi
else
    echo -e "${YELLOW}⚠${NC} Lighthouse not installed (npm install -g lighthouse)"
fi

# Summary
echo -e "\n======================================="
if [ $failures -eq 0 ]; then
    echo -e "${GREEN}Mobile compatibility check passed!${NC}"
else
    echo -e "${RED}Found $failures critical mobile issues${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Additional recommendations:${NC}"
echo "1. Test on real devices when possible"
echo "2. Use Chrome DevTools device emulation"
echo "3. Check touch interactions work properly"
echo "4. Verify text is readable without zooming"
echo "5. Ensure buttons are at least 44x44px"
echo "======================================="