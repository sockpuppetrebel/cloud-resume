# Deployment Testing Checklist

## Pre-Production Testing

### 1. Local Validation Tests
Run these before pushing to ensure basic functionality:

```bash
# Test 1: Validate HTML/CSS
cd site
python3 -m http.server 8000
# Open http://localhost:8000 and verify site loads correctly

# Test 2: Validate Azure Function locally
cd counter-func/slaterbot-func
npm install
npm start
# Test the function endpoint at http://localhost:7071/api/chathandler

# Test 3: Check for secrets in code
git grep -i "password\|secret\|key\|token" --exclude-dir=.git
```

### 2. GitHub Actions Dry Run
Test the workflow without affecting production:

1. Create a test branch:
```bash
git checkout -b test-deployment
```

2. Modify the workflow to use a test storage account (optional):
```yaml
# Temporarily add to deploy.yml for testing
env:
  AZURE_STORAGE_ACCOUNT: testresumestorage  # Use a test account
```

3. Push and monitor the Actions tab

### 3. Staging Environment Test
Before production deployment:

1. Deploy to staging branch first
2. Verify staging deployment completes successfully
3. Run smoke tests against staging environment

## Production Deployment Tests

### Phase 1: Pre-Deployment Checks

```bash
# Run this script before deployment
#!/bin/bash

echo "=== Pre-Deployment Validation ==="

# Check Azure connectivity
echo "1. Testing Azure login..."
az account show > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Azure CLI authenticated"
else
    echo "✗ Azure CLI not authenticated"
    exit 1
fi

# Verify resources exist
echo "2. Checking Azure resources..."
az storage account show --name jtsresumehosting > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Storage account exists"
else
    echo "✗ Storage account not found"
    exit 1
fi

az functionapp show --name slaterbot --resource-group Hosting > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Function app exists"
else
    echo "✗ Function app not found"
    exit 1
fi

# Check current site status
echo "3. Current site status..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://slater.cloud)
echo "Current site HTTP status: $response"

echo "=== Pre-deployment checks complete ==="
```

### Phase 2: Deployment Monitoring

1. **Watch GitHub Actions in real-time:**
   - Go to Actions tab
   - Click on the running workflow
   - Monitor each step for errors

2. **Check deployment logs for:**
   - ✓ Successful Azure login
   - ✓ File upload count matches expected
   - ✓ CDN purge initiated
   - ✓ Function deployment completed
   - ✓ Health check passed

### Phase 3: Post-Deployment Verification

```bash
# Run this script after deployment
#!/bin/bash

echo "=== Post-Deployment Verification ==="

# Test website availability
echo "1. Testing website..."
site_status=$(curl -s -o /dev/null -w "%{http_code}" https://slater.cloud)
if [ "$site_status" = "200" ]; then
    echo "✓ Website is accessible (HTTP $site_status)"
else
    echo "✗ Website returned HTTP $site_status"
fi

# Test specific pages
echo "2. Testing site pages..."
for page in "" "index.html" "chatbot.js" "styles.css"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" https://slater.cloud/$page)
    echo "  - /$page: HTTP $status"
done

# Test CDN cache
echo "3. Testing CDN headers..."
curl -I https://slater.cloud 2>/dev/null | grep -i "x-cache\|x-azure-ref"

# Test Azure Function
echo "4. Testing Azure Function..."
func_status=$(curl -s -o /dev/null -w "%{http_code}" https://slaterbot.azurewebsites.net/api/chathandler)
echo "  - Function endpoint: HTTP $func_status"

# Performance test
echo "5. Basic performance test..."
time curl -s https://slater.cloud > /dev/null
echo "  - Page load time recorded"

echo "=== Verification complete ==="
```

## Load Testing

### Basic Load Test
```bash
# Install Apache Bench if needed
# Ubuntu/Debian: sudo apt-get install apache2-utils
# Mac: already installed

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 https://slater.cloud/

# Test function endpoint (adjust based on your auth)
ab -n 50 -c 5 -p test-payload.json -T application/json https://slaterbot.azurewebsites.net/api/chathandler
```

### Monitor During Load Test
- Azure Portal > Storage Account > Metrics
- Azure Portal > Function App > Metrics
- CDN endpoint metrics

## Rollback Plan

If deployment fails or issues are detected:

### Immediate Rollback
1. **For website content:**
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# OR manually restore previous version
az storage blob upload-batch \
  --account-name jtsresumehosting \
  --source backup-site \
  --destination '$web' \
  --auth-mode login \
  --overwrite
```

2. **For Azure Function:**
```bash
# Deploy previous version
cd counter-func/slaterbot-func
git checkout HEAD~1
func azure functionapp publish slaterbot
```

### Emergency Procedures
1. **Site is completely down:**
   - Check Azure Portal for service health
   - Verify storage account accessibility
   - Check CDN endpoint status

2. **Function errors:**
   - View Function App logs in Azure Portal
   - Check Application Insights if configured
   - Disable function if causing site issues

## Automated Testing Integration

Add this job to your workflow for automated tests:

```yaml
  test-deployment:
    runs-on: ubuntu-latest
    needs: [deploy-website, deploy-function]
    name: Test Deployment
    
    steps:
      - name: Test website availability
        run: |
          for i in {1..5}; do
            status=$(curl -s -o /dev/null -w "%{http_code}" https://slater.cloud)
            if [ "$status" = "200" ]; then
              echo "✓ Site is up (attempt $i)"
              exit 0
            else
              echo "✗ Site returned $status (attempt $i)"
              sleep 10
            fi
          done
          exit 1
          
      - name: Test critical endpoints
        run: |
          # Test main pages
          curl -f https://slater.cloud/
          curl -f https://slater.cloud/index.html
          curl -f https://slater.cloud/styles.css
          
      - name: Basic performance check
        run: |
          response_time=$(curl -o /dev/null -s -w '%{time_total}' https://slater.cloud)
          echo "Response time: ${response_time}s"
          # Fail if response time > 3 seconds
          if (( $(echo "$response_time > 3" | bc -l) )); then
            echo "Response time too slow!"
            exit 1
          fi
```

## Success Criteria

Your deployment is production-ready when:

1. ✓ All pre-deployment checks pass
2. ✓ Workflow completes without errors
3. ✓ Post-deployment verification shows all green
4. ✓ Load test shows acceptable performance
5. ✓ Rollback procedure tested and documented
6. ✓ Monitoring alerts configured
7. ✓ Team knows emergency procedures

## Monitoring Setup

Configure these for production:

1. **Azure Application Insights** for function monitoring
2. **Azure Monitor alerts** for:
   - Storage account availability
   - Function app errors
   - CDN endpoint health
3. **Uptime monitoring** (e.g., Pingdom, UptimeRobot)
4. **GitHub Actions notifications** for deployment failures