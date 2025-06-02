#!/bin/bash

# Quick Deploy to Staging
# Bypasses full CI/CD for instant feedback

echo "======================================="
echo "Quick Deploy to Staging"
echo "======================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if we're on staging branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "staging" ]; then
    echo -e "${RED}Error: Not on staging branch${NC}"
    echo "Run: git checkout staging"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Uncommitted changes detected. Committing...${NC}"
    git add .
    git commit -m "Quick deploy: $(date '+%H:%M:%S')"
fi

# Quick deployment options
echo "Choose deployment speed:"
echo "1. 🚀 INSTANT (local only - for theme testing)"
echo "2. ⚡ FAST (staging deploy, skip tests) - ~2 minutes"
echo "3. 🔄 NORMAL (full pipeline) - ~5 minutes"
echo ""
read -p "Select option (1-3): " choice

case $choice in
    1)
        echo -e "${GREEN}Starting local development server...${NC}"
        ./scripts/dev-server.sh
        ;;
    2)
        echo -e "${YELLOW}Pushing with fast deployment...${NC}"
        
        # Push to staging
        git push origin staging
        
        echo -e "${GREEN}✓${NC} Pushed to staging"
        echo -e "${YELLOW}⏳${NC} Deploying... (check GitHub Actions for progress)"
        echo ""
        echo "🔗 Staging URL: https://nice-tree-05258a20f.6.azurestaticapps.net/"
        echo "📊 Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
        
        # Optional: Open URLs
        read -p "Open staging URL in browser? (y/n): " open_choice
        if [ "$open_choice" = "y" ]; then
            if command -v open >/dev/null 2>&1; then
                open "https://nice-tree-05258a20f.6.azurestaticapps.net/"
            elif command -v xdg-open >/dev/null 2>&1; then
                xdg-open "https://nice-tree-05258a20f.6.azurestaticapps.net/"
            fi
        fi
        ;;
    3)
        echo -e "${YELLOW}Running full deployment pipeline...${NC}"
        git push origin staging
        echo -e "${GREEN}✓${NC} Full pipeline started"
        echo "This includes mobile testing, Lighthouse audits, etc."
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo "======================================="