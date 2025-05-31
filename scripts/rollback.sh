#!/bin/bash

# Rollback script for emergency deployment recovery
# Usage: ./rollback.sh [website|function|both]

set -e

echo "======================================="
echo "Cloud Resume Emergency Rollback"
echo "======================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
STORAGE_ACCOUNT="jtsresumehosting"
FUNCTION_APP="slaterbot"
RESOURCE_GROUP="Hosting"
CDN_ENDPOINT="slatercloud"
CDN_PROFILE="resumecdn"

# Parse arguments
ROLLBACK_TARGET=${1:-both}

# Check Azure login
if ! az account show > /dev/null 2>&1; then
    echo -e "${RED}Error: Not logged into Azure CLI${NC}"
    echo "Run 'az login' first"
    exit 1
fi

# Function to rollback website
rollback_website() {
    echo -e "\n${YELLOW}Rolling back website...${NC}"
    
    # Get previous commit
    previous_commit=$(git rev-parse HEAD~1)
    echo "Rolling back to commit: $previous_commit"
    
    # Create temporary directory for previous version
    temp_dir=$(mktemp -d)
    echo "Created temporary directory: $temp_dir"
    
    # Extract previous version of site files
    git archive $previous_commit site | tar -x -C $temp_dir
    
    if [ -d "$temp_dir/site" ]; then
        echo "Uploading previous version to storage..."
        
        # Upload to storage
        az storage blob upload-batch \
            --account-name $STORAGE_ACCOUNT \
            --source "$temp_dir/site" \
            --destination '$web' \
            --auth-mode login \
            --overwrite
        
        # Purge CDN
        echo "Purging CDN cache..."
        az cdn endpoint purge \
            --name $CDN_ENDPOINT \
            --profile-name $CDN_PROFILE \
            --resource-group $RESOURCE_GROUP \
            --content-paths "/*"
        
        echo -e "${GREEN}✓${NC} Website rolled back successfully"
    else
        echo -e "${RED}✗${NC} Failed to extract previous site version"
        exit 1
    fi
    
    # Cleanup
    rm -rf $temp_dir
}

# Function to rollback Azure Function
rollback_function() {
    echo -e "\n${YELLOW}Rolling back Azure Function...${NC}"
    
    # Check if we have deployment slots
    slots=$(az functionapp deployment slot list \
        --name $FUNCTION_APP \
        --resource-group $RESOURCE_GROUP \
        --query "[].name" -o tsv)
    
    if [ -n "$slots" ]; then
        echo "Found deployment slots: $slots"
        echo "Swapping slots to rollback..."
        
        # Swap with staging slot if it exists
        if echo "$slots" | grep -q "staging"; then
            az functionapp deployment slot swap \
                --name $FUNCTION_APP \
                --resource-group $RESOURCE_GROUP \
                --slot staging \
                --target-slot production
            
            echo -e "${GREEN}✓${NC} Function rolled back using slot swap"
        else
            echo -e "${YELLOW}⚠${NC} No staging slot found, using git rollback"
            rollback_function_git
        fi
    else
        rollback_function_git
    fi
}

# Function to rollback using git
rollback_function_git() {
    # Get previous commit
    previous_commit=$(git rev-parse HEAD~1)
    
    # Create temporary directory
    temp_dir=$(mktemp -d)
    
    # Extract previous function code
    git archive $previous_commit counter-func/slaterbot-func | tar -x -C $temp_dir
    
    if [ -d "$temp_dir/counter-func/slaterbot-func" ]; then
        cd "$temp_dir/counter-func/slaterbot-func"
        
        echo "Installing dependencies..."
        npm ci --production
        
        echo "Creating deployment package..."
        zip -r function.zip . > /dev/null
        
        echo "Deploying to Azure Function..."
        az functionapp deployment source config-zip \
            --name $FUNCTION_APP \
            --resource-group $RESOURCE_GROUP \
            --src function.zip
        
        echo -e "${GREEN}✓${NC} Function rolled back successfully"
        
        # Cleanup
        cd - > /dev/null
        rm -rf $temp_dir
    else
        echo -e "${RED}✗${NC} Failed to extract previous function version"
        exit 1
    fi
}

# Function to verify rollback
verify_rollback() {
    echo -e "\n${YELLOW}Verifying rollback...${NC}"
    
    if [ "$ROLLBACK_TARGET" = "website" ] || [ "$ROLLBACK_TARGET" = "both" ]; then
        # Test website
        site_status=$(curl -s -o /dev/null -w "%{http_code}" https://slater.cloud)
        if [ "$site_status" = "200" ]; then
            echo -e "${GREEN}✓${NC} Website is accessible (HTTP $site_status)"
        else
            echo -e "${RED}✗${NC} Website returned HTTP $site_status"
        fi
    fi
    
    if [ "$ROLLBACK_TARGET" = "function" ] || [ "$ROLLBACK_TARGET" = "both" ]; then
        # Test function
        func_status=$(curl -s -o /dev/null -w "%{http_code}" https://$FUNCTION_APP.azurewebsites.net/api/chathandler)
        if [ "$func_status" = "401" ] || [ "$func_status" = "200" ]; then
            echo -e "${GREEN}✓${NC} Function is responding (HTTP $func_status)"
        else
            echo -e "${RED}✗${NC} Function returned HTTP $func_status"
        fi
    fi
}

# Main execution
case $ROLLBACK_TARGET in
    website)
        echo "Target: Website only"
        rollback_website
        ;;
    function)
        echo "Target: Function only"
        rollback_function
        ;;
    both)
        echo "Target: Website and Function"
        rollback_website
        rollback_function
        ;;
    *)
        echo -e "${RED}Invalid target: $ROLLBACK_TARGET${NC}"
        echo "Usage: $0 [website|function|both]"
        exit 1
        ;;
esac

# Verify rollback
verify_rollback

# Create rollback report
echo -e "\n${YELLOW}Creating rollback report...${NC}"
report_file="rollback-report-$(date +%Y%m%d-%H%M%S).txt"

cat > $report_file << EOF
Rollback Report
===============
Date: $(date)
Target: $ROLLBACK_TARGET
Previous Commit: $(git rev-parse HEAD~1)
Current Commit: $(git rev-parse HEAD)

Rollback Status:
- Website: $([ "$ROLLBACK_TARGET" = "website" ] || [ "$ROLLBACK_TARGET" = "both" ] && echo "Rolled back" || echo "Not changed")
- Function: $([ "$ROLLBACK_TARGET" = "function" ] || [ "$ROLLBACK_TARGET" = "both" ] && echo "Rolled back" || echo "Not changed")

Verification:
- Website Status: $site_status
- Function Status: $func_status

Next Steps:
1. Monitor application for any issues
2. Investigate the cause of the failed deployment
3. Fix issues in a new commit
4. Test thoroughly before re-deploying
EOF

echo -e "${GREEN}✓${NC} Rollback report saved to: $report_file"

echo -e "\n======================================="
echo -e "${GREEN}Rollback completed${NC}"
echo "Please monitor the application and investigate the deployment failure"
echo "======================================="