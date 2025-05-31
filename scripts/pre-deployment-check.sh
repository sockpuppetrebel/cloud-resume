#!/bin/bash

# Pre-deployment validation script
# Run this before pushing to main to ensure deployment readiness

set -e

echo "======================================="
echo "Pre-Deployment Validation for Cloud Resume"
echo "======================================="

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command existence
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check required tools
echo -e "\n${YELLOW}Checking required tools...${NC}"
tools=("git" "az" "curl" "node" "npm")
all_tools_exist=true

for tool in "${tools[@]}"; do
    if command_exists "$tool"; then
        echo -e "${GREEN}✓${NC} $tool is installed"
    else
        echo -e "${RED}✗${NC} $tool is not installed"
        all_tools_exist=false
    fi
done

if [ "$all_tools_exist" = false ]; then
    echo -e "${RED}Please install missing tools before proceeding${NC}"
    exit 1
fi

# 2. Check Git status
echo -e "\n${YELLOW}Checking Git status...${NC}"
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC} Working directory is clean"
else
    echo -e "${RED}✗${NC} Uncommitted changes detected:"
    git status --short
    echo -e "${YELLOW}Please commit or stash changes before deployment${NC}"
    exit 1
fi

# Check current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo -e "Current branch: ${YELLOW}$current_branch${NC}"

# 3. Validate local files
echo -e "\n${YELLOW}Validating project files...${NC}"
required_files=(
    "site/index.html"
    "site/styles.css"
    "site/chatbot.js"
    "counter-func/slaterbot-func/package.json"
    "counter-func/slaterbot-func/chathandler/index.js"
    ".github/workflows/deploy.yml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file is missing"
        exit 1
    fi
done

# 4. Test Azure connectivity
echo -e "\n${YELLOW}Testing Azure connectivity...${NC}"
if az account show > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Azure CLI is authenticated"
    account_name=$(az account show --query name -o tsv)
    subscription_id=$(az account show --query id -o tsv)
    echo "  Account: $account_name"
    echo "  Subscription: $subscription_id"
else
    echo -e "${RED}✗${NC} Azure CLI not authenticated"
    echo "Run 'az login' to authenticate"
    exit 1
fi

# 5. Verify Azure resources
echo -e "\n${YELLOW}Verifying Azure resources...${NC}"

# Check storage account
if az storage account show --name jtsresumehosting > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Storage account 'jtsresumehosting' exists"
else
    echo -e "${RED}✗${NC} Storage account 'jtsresumehosting' not found"
    exit 1
fi

# Check function app
if az functionapp show --name slaterbot --resource-group Hosting > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Function app 'slaterbot' exists"
    runtime=$(az functionapp show --name slaterbot --resource-group Hosting --query "siteConfig.nodeVersion" -o tsv)
    echo "  Runtime: Node.js $runtime"
else
    echo -e "${RED}✗${NC} Function app 'slaterbot' not found"
    exit 1
fi

# Check CDN
if az cdn endpoint show --name slatercloud --profile-name resumecdn --resource-group Hosting > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} CDN endpoint 'slatercloud' exists"
else
    echo -e "${RED}✗${NC} CDN endpoint 'slatercloud' not found"
    exit 1
fi

# 6. Test current production site
echo -e "\n${YELLOW}Testing current production site...${NC}"
prod_status=$(curl -s -o /dev/null -w "%{http_code}" https://slater.cloud)
if [ "$prod_status" = "200" ]; then
    echo -e "${GREEN}✓${NC} Production site is up (HTTP $prod_status)"
else
    echo -e "${YELLOW}⚠${NC} Production site returned HTTP $prod_status"
fi

# 7. Validate function dependencies
echo -e "\n${YELLOW}Validating function dependencies...${NC}"
cd counter-func/slaterbot-func
if npm list --depth=0 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Function dependencies are valid"
else
    echo -e "${RED}✗${NC} Function dependencies have issues"
    echo "Run 'npm install' in counter-func/slaterbot-func"
    exit 1
fi
cd ../..

# 8. Check for sensitive data
echo -e "\n${YELLOW}Checking for sensitive data...${NC}"
sensitive_patterns=("password" "secret" "apikey" "api_key" "token" "credential")
found_sensitive=false

for pattern in "${sensitive_patterns[@]}"; do
    if git grep -i "$pattern" --exclude-dir=.git --exclude="*.md" --exclude="scripts/*" > /dev/null 2>&1; then
        echo -e "${RED}✗${NC} Found potential sensitive data with pattern: $pattern"
        found_sensitive=true
    fi
done

if [ "$found_sensitive" = false ]; then
    echo -e "${GREEN}✓${NC} No obvious sensitive data found"
else
    echo -e "${YELLOW}⚠${NC} Please review the files for sensitive data"
fi

# Summary
echo -e "\n======================================="
if [ "$found_sensitive" = false ]; then
    echo -e "${GREEN}All pre-deployment checks passed!${NC}"
    echo -e "\nNext steps:"
    echo "1. Review changes one more time"
    echo "2. Push to main branch: git push origin main"
    echo "3. Monitor GitHub Actions for deployment status"
    echo "4. Run post-deployment verification after completion"
else
    echo -e "${YELLOW}Pre-deployment checks completed with warnings${NC}"
    echo "Please review the warnings before proceeding"
fi
echo "======================================="