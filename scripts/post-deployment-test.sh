#!/bin/bash

# Post-deployment smoke test script
# Run this after deployment to verify everything is working

set -e

echo "======================================="
echo "Post-Deployment Verification"
echo "======================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
SITE_URL="https://slater.cloud"
FUNCTION_URL="https://slaterbot.azurewebsites.net"
MAX_RESPONSE_TIME=3
RETRY_COUNT=3
RETRY_DELAY=5

# Test results
total_tests=0
passed_tests=0

# Helper function to test URL
test_url() {
    local url=$1
    local expected_status=$2
    local test_name=$3
    local retry_count=${4:-1}
    
    total_tests=$((total_tests + 1))
    
    for i in $(seq 1 $retry_count); do
        response=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" "$url")
        status_code=$(echo $response | cut -d: -f1)
        response_time=$(echo $response | cut -d: -f2)
        
        if [ "$status_code" = "$expected_status" ]; then
            echo -e "${GREEN}✓${NC} $test_name (HTTP $status_code, ${response_time}s)"
            passed_tests=$((passed_tests + 1))
            return 0
        elif [ $i -lt $retry_count ]; then
            echo -e "${YELLOW}⚠${NC} $test_name failed (HTTP $status_code), retrying in ${RETRY_DELAY}s..."
            sleep $RETRY_DELAY
        fi
    done
    
    echo -e "${RED}✗${NC} $test_name (HTTP $status_code, expected $expected_status)"
    return 1
}

# 1. Test main website
echo -e "\n${YELLOW}Testing website availability...${NC}"
test_url "$SITE_URL" "200" "Main website" $RETRY_COUNT

# 2. Test static resources
echo -e "\n${YELLOW}Testing static resources...${NC}"
test_url "$SITE_URL/index.html" "200" "index.html"
test_url "$SITE_URL/styles.css" "200" "styles.css"
test_url "$SITE_URL/chatbot.js" "200" "chatbot.js"
test_url "$SITE_URL/chatbot.css" "200" "chatbot.css"
test_url "$SITE_URL/selfie.jpg" "200" "selfie.jpg"
test_url "$SITE_URL/pdxthings.jpg" "200" "pdxthings.jpg"

# 3. Test 404 handling
echo -e "\n${YELLOW}Testing error handling...${NC}"
test_url "$SITE_URL/non-existent-file.html" "404" "404 error page"

# 4. Test CDN headers
echo -e "\n${YELLOW}Testing CDN configuration...${NC}"
total_tests=$((total_tests + 1))
cdn_headers=$(curl -sI "$SITE_URL" | grep -i "x-cache\|x-azure-ref\|cache-control")
if [ -n "$cdn_headers" ]; then
    echo -e "${GREEN}✓${NC} CDN headers present:"
    echo "$cdn_headers" | sed 's/^/  /'
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗${NC} CDN headers not found"
fi

# 5. Test Azure Function
echo -e "\n${YELLOW}Testing Azure Function...${NC}"
test_url "$FUNCTION_URL/api/chathandler" "401" "Function endpoint (expecting 401 for auth)" $RETRY_COUNT

# 6. Performance tests
echo -e "\n${YELLOW}Running performance tests...${NC}"
total_tests=$((total_tests + 1))
avg_time=0
perf_test_count=5

echo "Testing page load times ($perf_test_count requests)..."
for i in $(seq 1 $perf_test_count); do
    time=$(curl -s -o /dev/null -w "%{time_total}" "$SITE_URL")
    avg_time=$(echo "$avg_time + $time" | bc)
    echo -e "  Request $i: ${time}s"
done

avg_time=$(echo "scale=3; $avg_time / $perf_test_count" | bc)
echo -e "Average response time: ${avg_time}s"

if (( $(echo "$avg_time < $MAX_RESPONSE_TIME" | bc -l) )); then
    echo -e "${GREEN}✓${NC} Performance test passed (avg ${avg_time}s < ${MAX_RESPONSE_TIME}s)"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗${NC} Performance test failed (avg ${avg_time}s > ${MAX_RESPONSE_TIME}s)"
fi

# 7. Content verification
echo -e "\n${YELLOW}Verifying content integrity...${NC}"
total_tests=$((total_tests + 1))
content=$(curl -s "$SITE_URL")
required_strings=(
    "Jason Slater"
    "Portland"
    "resume"
    "chatbot"
)

content_valid=true
for string in "${required_strings[@]}"; do
    if echo "$content" | grep -q "$string"; then
        echo -e "  ${GREEN}✓${NC} Found: '$string'"
    else
        echo -e "  ${RED}✗${NC} Missing: '$string'"
        content_valid=false
    fi
done

if [ "$content_valid" = true ]; then
    echo -e "${GREEN}✓${NC} Content verification passed"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗${NC} Content verification failed"
fi

# 8. SSL certificate check
echo -e "\n${YELLOW}Checking SSL certificate...${NC}"
total_tests=$((total_tests + 1))
cert_info=$(echo | openssl s_client -servername slater.cloud -connect slater.cloud:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} SSL certificate is valid"
    echo "$cert_info" | sed 's/^/  /'
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}✗${NC} SSL certificate check failed"
fi

# 9. Test CORS headers (if applicable)
echo -e "\n${YELLOW}Testing CORS configuration...${NC}"
total_tests=$((total_tests + 1))
cors_headers=$(curl -sI -H "Origin: https://slater.cloud" "$FUNCTION_URL/api/chathandler" | grep -i "access-control-allow-origin")
if [ -n "$cors_headers" ]; then
    echo -e "${GREEN}✓${NC} CORS headers configured:"
    echo "$cors_headers" | sed 's/^/  /'
    passed_tests=$((passed_tests + 1))
else
    echo -e "${YELLOW}⚠${NC} No CORS headers found (may be expected)"
fi

# Summary
echo -e "\n======================================="
echo -e "Test Summary: ${passed_tests}/${total_tests} tests passed"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}All tests passed! Deployment verified successfully.${NC}"
    exit 0
else
    failed_tests=$((total_tests - passed_tests))
    echo -e "${RED}$failed_tests tests failed. Please investigate.${NC}"
    
    echo -e "\n${YELLOW}Troubleshooting steps:${NC}"
    echo "1. Check GitHub Actions logs for deployment errors"
    echo "2. Verify Azure resources in the portal"
    echo "3. Check CDN propagation (may take a few minutes)"
    echo "4. Review function logs in Azure Portal"
    exit 1
fi