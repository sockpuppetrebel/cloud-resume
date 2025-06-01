#!/bin/bash

# Staging Cache Diagnostic Script
# This helps determine if Azure Static Web Apps is serving cached content

echo "======================================="
echo "Azure Static Web Apps Cache Diagnostics"
echo "======================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get staging URL (you'll need to replace this with your actual staging URL)
echo -e "${YELLOW}Enter your staging site URL (e.g., https://your-staging-site.azurestaticapps.net):${NC}"
read STAGING_URL

if [ -z "$STAGING_URL" ]; then
    echo -e "${RED}No URL provided. Exiting.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Testing staging site: $STAGING_URL${NC}"

# 1. Check response headers for cache information
echo -e "\n${YELLOW}1. Checking HTTP headers for cache information...${NC}"
curl -sI "$STAGING_URL" | grep -i -E "cache-control|etag|last-modified|x-azure|age|expires"

# 2. Check if new content is present
echo -e "\n${YELLOW}2. Checking for recent content additions...${NC}"
content=$(curl -s "$STAGING_URL")

# Check for the README button we added
if echo "$content" | grep -q "View Documentation & Code"; then
    echo -e "${GREEN}✓${NC} README viewer button found"
else
    echo -e "${RED}✗${NC} README viewer button NOT found"
fi

# Check for recent learning items
if echo "$content" | grep -q "Interactive Learning Timeline"; then
    echo -e "${GREEN}✓${NC} Interactive Learning Timeline found"
else
    echo -e "${RED}✗${NC} Interactive Learning Timeline NOT found"
fi

if echo "$content" | grep -q "GitHub Stats Integration"; then
    echo -e "${GREEN}✓${NC} GitHub Stats Integration found"
else
    echo -e "${RED}✗${NC} GitHub Stats Integration NOT found"
fi

if echo "$content" | grep -q "Chatbot UX Enhancement"; then
    echo -e "${GREEN}✓${NC} Chatbot UX Enhancement found"
else
    echo -e "${RED}✗${NC} Chatbot UX Enhancement NOT found"
fi

# 3. Test with cache busting
echo -e "\n${YELLOW}3. Testing with cache-busting parameter...${NC}"
cache_bust_url="${STAGING_URL}?cb=$(date +%s)"
bust_content=$(curl -s "$cache_bust_url")

if echo "$bust_content" | grep -q "View Documentation & Code"; then
    echo -e "${GREEN}✓${NC} Cache-busted request shows new content"
else
    echo -e "${RED}✗${NC} Even cache-busted request shows old content"
fi

# 4. Check file timestamps in HTML
echo -e "\n${YELLOW}4. Looking for build timestamps or version indicators...${NC}"
echo "$content" | grep -i -E "build|version|timestamp|generated" | head -3

# 5. Test specific new files
echo -e "\n${YELLOW}5. Testing direct access to new files...${NC}"
readme_url="${STAGING_URL}/readme-viewer.html"
readme_status=$(curl -s -o /dev/null -w "%{http_code}" "$readme_url")

if [ "$readme_status" = "200" ]; then
    echo -e "${GREEN}✓${NC} readme-viewer.html is accessible (HTTP $readme_status)"
else
    echo -e "${RED}✗${NC} readme-viewer.html returned HTTP $readme_status"
fi

# 6. Compare with local file
echo -e "\n${YELLOW}6. Comparing with local version...${NC}"
if [ -f "site/index.html" ]; then
    local_content=$(cat site/index.html)
    if echo "$local_content" | grep -q "View Documentation & Code"; then
        echo -e "${GREEN}✓${NC} Local file contains new content"
    else
        echo -e "${RED}✗${NC} Local file missing new content"
    fi
    
    # Quick diff check
    echo -e "\nContent length comparison:"
    echo "Remote: $(echo "$content" | wc -c) characters"
    echo "Local:  $(echo "$local_content" | wc -c) characters"
    
    if [ "$(echo "$content" | wc -c)" -eq "$(echo "$local_content" | wc -c)" ]; then
        echo -e "${GREEN}✓${NC} Content lengths match"
    else
        echo -e "${YELLOW}⚠${NC} Content lengths differ"
    fi
else
    echo -e "${RED}✗${NC} Local site/index.html not found"
fi

# 7. Check last deployment time (if available)
echo -e "\n${YELLOW}7. Checking for deployment indicators...${NC}"
echo "$content" | grep -i -E "deploy|build|commit" | head -2

echo -e "\n======================================="
echo -e "${YELLOW}Summary:${NC}"
echo "If the cache-busted request shows old content, it's likely a deployment issue."
echo "If cache-busted shows new content but normal request doesn't, it's a caching issue."
echo "Check GitHub Actions for recent deployment status."
echo "======================================="